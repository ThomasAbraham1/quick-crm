
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type TemplateDocument = HydratedDocument<Template>;

@Schema()
export class Template {
    // User who owns this template (for multi-tenancy)
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId: mongoose.Types.ObjectId;

    @Prop({ required: true })
    subject: string;

    @Prop({ required: true })
    body: string;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
