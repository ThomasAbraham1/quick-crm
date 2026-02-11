
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type CampaignDocument = HydratedDocument<Campaign>;

@Schema()
export class Campaign {
    // User who owns this campaign (for multi-tenancy)
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId: mongoose.Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    templateId: string;

    @Prop({ default: 0 })
    totalContacts: number;

    @Prop({ default: 0 })
    sentCount: number;

    @Prop({ default: 0 })
    openedCount: number;

    @Prop({ default: 0 })
    failedCount: number;

    @Prop({ default: 'running' }) // running, completed, failed
    status: string;

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
