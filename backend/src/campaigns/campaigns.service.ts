
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign } from '../schemas/campaign.schema';

@Injectable()
export class CampaignsService {
    constructor(@InjectModel(Campaign.name) private campaignModel: Model<Campaign>) { }

    async create(campaignData: { name: string; templateId: string; totalContacts: number }) {
        const campaign = new this.campaignModel(campaignData);
        return campaign.save();
    }

    async findAll() {
        return this.campaignModel.find().sort({ createdAt: -1 }).exec();
    }

    async findOne(id: string) {
        return this.campaignModel.findById(id).exec();
    }

    async incrementSent(id: string) {
        return this.campaignModel.findByIdAndUpdate(
            id,
            { $inc: { sentCount: 1 } },
            { new: true }
        );
    }

    async incrementOpened(id: string) {
        return this.campaignModel.findByIdAndUpdate(
            id,
            { $inc: { openedCount: 1 } },
            { new: true }
        );
    }

    async incrementFailed(id: string) {
        return this.campaignModel.findByIdAndUpdate(
            id,
            { $inc: { failedCount: 1 } },
            { new: true }
        );
    }

    async markComplete(id: string) {
        return this.campaignModel.findByIdAndUpdate(
            id,
            { status: 'completed' },
            { new: true }
        );
    }
}
