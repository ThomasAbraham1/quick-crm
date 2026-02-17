
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign } from '../schemas/campaign.schema';

@Injectable()
export class CampaignsService {
    constructor(@InjectModel(Campaign.name) private campaignModel: Model<Campaign>) { }

    async create(userId: string, campaignData: { name: string; templateId: string; totalContacts: number }) {
        const campaign = new this.campaignModel({ ...campaignData, userId });
        return campaign.save();
    }

    async findAll(userId: string, page: number = 1, limit: number = 20) {
        page = Math.max(1, page);
        limit = Math.max(1, Math.min(100, limit));

        const skip = (page - 1) * limit;

        const total = await this.campaignModel.countDocuments({ userId }).exec();

        const data = await this.campaignModel
            .find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();

        return {
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        };
    }

    async findOne(userId: string, id: string) {
        return this.campaignModel.findOne({ _id: id, userId }).exec();
    }

    async incrementSent(userId: string, id: string) {
        const campaign = await this.campaignModel.findOneAndUpdate(
            { _id: id, userId },
            { $inc: { sentCount: 1 } },
            { new: true }
        );
        // Auto-update status when emails are processed
        await this.checkAndUpdateStatus(userId, id);
        return campaign;
    }

    async incrementOpened(userId: string, id: string) {
        return this.campaignModel.findOneAndUpdate(
            { _id: id, userId },
            { $inc: { openedCount: 1 } },
            { new: true }
        );
    }

    async incrementFailed(userId: string, id: string) {
        const campaign = await this.campaignModel.findOneAndUpdate(
            { _id: id, userId },
            { $inc: { failedCount: 1 } },
            { new: true }
        );
        // Auto-update status when emails are processed
        await this.checkAndUpdateStatus(userId, id);
        return campaign;
    }

    async markComplete(userId: string, id: string) {
        return this.campaignModel.findOneAndUpdate(
            { _id: id, userId },
            { status: 'completed' },
            { new: true }
        );
    }

    /**
     * Automatically checks and updates campaign status based on completion
     * Called after each email is sent or fails
     */
    private async checkAndUpdateStatus(userId: string, id: string) {
        const campaign = await this.findOne(userId, id);

        if (!campaign) return;

        const processed = campaign.sentCount + campaign.failedCount;

        // Only update status if campaign is complete
        if (processed >= campaign.totalContacts && campaign.status === 'running') {
            let newStatus: string;

            if (campaign.failedCount === campaign.totalContacts) {
                // All emails failed
                newStatus = 'failed';
            } else if (campaign.failedCount === 0) {
                // All emails sent successfully
                newStatus = 'completed';
            } else {
                // Partial failure - some sent, some failed
                const failureRate = (campaign.failedCount / campaign.totalContacts) * 100;

                if (failureRate >= 50) {
                    // More than 50% failed - consider it mostly failed
                    newStatus = 'failed';
                } else {
                    // Less than 50% failed - completed with some failures
                    newStatus = 'completed_with_failures';
                }
            }

            await this.campaignModel.findOneAndUpdate(
                { _id: id, userId },
                { status: newStatus },
                { new: true }
            );
        }
    }
}
