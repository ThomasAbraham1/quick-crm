import { WorkerHost, Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Contact } from '../schemas/contact.schema';
import { Template } from '../schemas/template.schema';
import { Logger } from '@nestjs/common';
import { CampaignsService } from '../campaigns/campaigns.service';

@Processor('email-queue', {
    limiter: {
        max: 1,
        duration: 30000, // 30 seconds delay between jobs
    },
})
export class MailProcessor extends WorkerHost {
    private transporter;
    private readonly logger = new Logger(MailProcessor.name);

    constructor(
        @InjectModel(Contact.name) private contactModel: Model<Contact>,
        @InjectModel(Template.name) private templateModel: Model<Template>,
        private configService: ConfigService,
        private campaignsService: CampaignsService,
    ) {
        super();
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.configService.get('MAIL_USER'),
                pass: this.configService.get('MAIL_PASS'),
            },
        });
    }

    async process(job: Job<any, any, string>): Promise<any> {
        const { contactId, templateId, campaignId, userId } = job.data;
        this.logger.log(`Processing email for contact ${contactId}, template ${templateId}`);

        const contact = await this.contactModel.findById(contactId);
        const template = await this.templateModel.findById(templateId);

        if (!contact || !template) {
            this.logger.error(`Missing - Contact: ${!!contact}, Template: ${!!template}, ContactID: ${contactId}, TemplateID: ${templateId}`);
            if (campaignId && userId) {
                await this.campaignsService.incrementFailed(userId, campaignId);
            }
            return;
        }

        // Safety Check: Duplicate Prevention (Global check by email)
        const { force } = job.data;

        if (!force) {
            // Check if ANY contact with this email has received this template
            const alreadyHashMap = await this.contactModel.exists({
                email: contact.email,
                history: templateId.trim()
            });

            if (alreadyHashMap) {
                this.logger.warn(`Skipping contact ${contact.email}: Template ${templateId} already sent (History found on a contact doc).`);
                return;
            }
        }

        // Simple variable replacement
        let body = template.body;
        let subject = template.subject;

        body = body.replace(/{{name}}/gi, contact.name);
        subject = subject.replace(/{{name}}/gi, contact.name);

        // Inject tracking pixel for open tracking
        const baseUrl = this.configService.get('BASE_URL') || 'http://localhost:3000';
        const trackingPixel = `<img src="${baseUrl}/track/open?campaignId=${campaignId}&contactId=${contactId}&userId=${userId}" width="1" height="1" style="display:none;" />`;
        body = body + trackingPixel;

        this.logger.log(`📧 Tracking pixel URL: ${baseUrl}/track/open?campaignId=${campaignId}&contactId=${contactId}`);

        try {
            await this.transporter.sendMail({
                from: this.configService.get('MAIL_USER'),
                to: contact.email,
                subject: subject,
                html: body,
                text: body.replace(/<[^>]*>?/gm, ''), // Fallback plain text (strip tags)
            });

            contact.status = 'sent';
            contact.history = contact.history || [];
            (contact.history as string[]).push(templateId.trim());
            contact.markModified('history'); // Explicitly tell Mongoose to update this field
            await contact.save();

            // Update campaign stats
            if (campaignId && userId) {
                await this.campaignsService.incrementSent(userId, campaignId);
            }

            this.logger.log(`Email sent to ${contact.email}. History updated.`);
        } catch (error) {
            this.logger.error(`Failed to send email to ${contact.email}`, error);
            contact.status = 'failed';
            await contact.save();

            // Update campaign stats
            if (campaignId && userId) {
                await this.campaignsService.incrementFailed(userId, campaignId);
            }
            throw error; // Let BullMQ handle retry
        }
    }
}
