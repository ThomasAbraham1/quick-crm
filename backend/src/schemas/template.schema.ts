
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TemplateDocument = HydratedDocument<Template>;

@Schema()
export class Template {
    @Prop({ required: true })
    subject: string;

    @Prop({ required: true })
    body: string;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
