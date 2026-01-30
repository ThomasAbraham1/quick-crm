import { Controller, Post, Body, Get, Param, Res, Query } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from '../schemas/contact.schema';
import { Template } from '../schemas/template.schema';
import { CampaignsService } from '../campaigns/campaigns.service';
import { Response } from 'express';

@Controller('mail')
export class MailController {
    constructor(
        @InjectQueue('email-queue') private emailQueue: Queue,
        @InjectModel(Contact.name) private contactModel: Model<Contact>,
        @InjectModel(Template.name) private templateModel: Model<Template>,
        private campaignsService: CampaignsService,
    ) { }

    @Post('check-campaign')
    async checkCampaign(@Body() body: { templateId: string; contacts: any[] }) {
        const contactEmails = body.contacts.map(c => c.email);

        // Find contacts that ALREADY have this template in history
        const duplicates = await this.contactModel.find({
            email: { $in: contactEmails },
            history: body.templateId.trim()
        }).select('email').exec();

        const duplicateEmails = duplicates.map(d => d.email);

        return {
            total: contactEmails.length,
            duplicates: duplicateEmails,
            duplicateCount: duplicateEmails.length,
            newContacts: contactEmails.length - duplicateEmails.length
        };
    }

    @Post('launch')
    async launchCampaign(@Body() body: { templateId: string; contacts: any[]; force?: boolean; name?: string }) {
        // 1. Create Campaign Record
        const campaignName = body.name || `Campaign ${new Date().toISOString()}`;
        const campaign = await this.campaignsService.create({
            name: campaignName,
            templateId: body.templateId,
            totalContacts: body.contacts.length
        });

        // 2. Save/Update Contacts
        const savedContacts = [];
        for (const c of body.contacts) {
            let contact = await this.contactModel.findOneAndUpdate(
                { email: c.email },
                { $set: c, $setOnInsert: { dateAdded: new Date() } },
                { new: true, upsert: true }
            );
            savedContacts.push(contact);
        }

        // 3. Filter Duplicates (Optimize Queue Usage)
        const jobs = [];
        for (const contact of savedContacts) {
            if (!body.force) {
                // Double check locally before enqueueing
                if (contact.history && contact.history.includes(body.templateId.trim())) {
                    continue; // Skip silently
                }
            }

            jobs.push({
                name: 'send-email',
                data: {
                    contactId: contact._id,
                    templateId: body.templateId,
                    campaignId: campaign._id.toString(),
                    force: !!body.force
                }
            });
        }

        // 4. Batch add to queue
        if (jobs.length > 0) {
            await this.emailQueue.addBulk(jobs);
        }

        return {
            campaignId: campaign._id,
            message: `Campaign queued for ${jobs.length} contacts.`,
            skipped: savedContacts.length - jobs.length
        };
    }

    // Helper to create a template quickly
    @Post('template')
    async createTemplate(@Body() body: { subject: string; body: string }) {
        const t = new this.templateModel(body);
        return t.save();
    }
}

@Controller('track')
export class TrackingController {
    constructor(private campaignsService: CampaignsService) { }

    @Get('open')
    async trackOpen(@Query('campaignId') campaignId: string, @Query('contactId') contactId: string, @Res() res: Response) {
        console.log('🎯 TRACKING PIXEL HIT!', { campaignId, contactId });

        // Increment opened count for campaign
        if (campaignId) {
            try {
                await this.campaignsService.incrementOpened(campaignId);
                console.log('✅ Incremented openedCount for campaign:', campaignId);
            } catch (err) {
                console.error('❌ Error incrementing:', err);
            }
        }

        // Return a 1x1 transparent GIF
        const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
        res.writeHead(200, {
            'Content-Type': 'image/gif',
            'Content-Length': pixel.length,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
        });
        res.end(pixel);
    }
}
