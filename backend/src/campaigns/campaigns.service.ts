
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

    async findAll(userId: string) {
        return this.campaignModel.find({ userId }).sort({ createdAt: -1 }).exec();
    }

    async findOne(userId: string, id: string) {
        return this.campaignModel.findOne({ _id: id, userId }).exec();
    }

    async incrementSent(userId: string, id: string) {
        return this.campaignModel.findOneAndUpdate(
            { _id: id, userId },
            { $inc: { sentCount: 1 } },
            { new: true }
        );
    }

    async incrementOpened(userId: string, id: string) {
        return this.campaignModel.findOneAndUpdate(
            { _id: id, userId },
            { $inc: { openedCount: 1 } },
            { new: true }
        );
    }

    async incrementFailed(userId: string, id: string) {
        return this.campaignModel.findOneAndUpdate(
            { _id: id, userId },
            { $inc: { failedCount: 1 } },
            { new: true }
        );
    }

    async markComplete(userId: string, id: string) {
        return this.campaignModel.findOneAndUpdate(
            { _id: id, userId },
            { status: 'completed' },
            { new: true }
        );
    }
}
