import { WorkerHost, Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Contact } from '../schemas/contact.schema';
import { Template } from '../schemas/template.schema';
import { User } from '../schemas/user.schema'; // Added User import
import { Logger } from '@nestjs/common';
import { CampaignsService } from '../campaigns/campaigns.service';

@Processor('email-queue', {
    limiter: {
        max: 1,
        duration: 30000, // 30 seconds delay between jobs
    },
})
export class MailProcessor extends WorkerHost {
    private readonly logger = new Logger(MailProcessor.name);

    constructor(
        private configService: ConfigService,
        @InjectModel(Contact.name) private contactModel: Model<Contact>,
        @InjectModel(Template.name) private templateModel: Model<Template>,
        @InjectModel(User.name) private userModel: Model<User>, // Injected UserModel
        private campaignsService: CampaignsService,
    ) {
        super();
    }

    async process(job: Job): Promise<any> { // Updated Job type
        const { campaignId, templateId, contactId, userId, force } = job.data;
        this.logger.debug(`Processing email for campaign: ${campaignId}, user: ${userId}`);
        console.log('UserId in mail processor: ', userId)
        // 1. Fetch User and Credentials
        const user = await this.userModel.findById(userId);
        console.log('User in mail processor: ', user)
        if (!user || !user.refreshToken) {
            this.logger.error(`User ${userId} not found or missing refresh token. Cannot send email.`);
            throw new Error('User not authorized to send emails (missing refresh token)');
        }

        // 2. Create Dynamic Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: user.email,
                clientId: this.configService.get('GOOGLE_CLIENT_ID'),
                clientSecret: this.configService.get('GOOGLE_CLIENT_SECRET'),
                refreshToken: user.refreshToken,
                accessToken: user.accessToken,
            },
        });

        // 3. Fetch Data
        const contact = await this.contactModel.findOne({ _id: contactId, userId }); // Added userId to query
        const template = await this.templateModel.findOne({ _id: templateId, userId }); // Added userId to query

        if (!contact || !template) {
            this.logger.error(`Missing - Contact: ${!!contact}, Template: ${!!template}, ContactID: ${contactId}, TemplateID: ${templateId}`);
            if (campaignId && userId) {
                await this.campaignsService.incrementFailed(userId, campaignId);
            }
            return;
        }

        // 4. Check for duplicates logic
        // Check if already sent (idempotency) - skip if force flag is true
        if (!force && contact.history && contact.history.includes(templateId.trim())) {
            this.logger.warn(`Skipping contact ${contact.email}: Template ${templateId} already sent (found in contact history).`);
            return;
        }

        // Double check via hash map if needed, but history array is safer
        // Removed non-existent campaignsService.checkIfSent call


        // Simple variable replacement
        let body = template.body;
        let subject = template.subject;

        body = body.replace(/{{name}}/gi, contact.name);
        subject = subject.replace(/{{name}}/gi, contact.name);

        // Inject tracking pixel for open tracking
        const baseUrl = this.configService.get('BASE_URL') || 'http://localhost:3002';
        const trackingPixel = `<img src="${baseUrl}/track/open?campaignId=${campaignId}&contactId=${contactId}&userId=${userId}" width="1" height="1" style="display:none;" />`;
        body = body + trackingPixel;

        this.logger.log(`📧 Tracking pixel URL: ${baseUrl}/track/open?campaignId=${campaignId}&contactId=${contactId}&userId=${userId}`);

        try {
            await transporter.sendMail({ // Using dynamic transporter
                from: `${user.name} <${user.email}>`, // Using User's Name and Email
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

            this.logger.log(`Email sent from ${user.email} to ${contact.email}. History updated.`); // Updated log message
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
