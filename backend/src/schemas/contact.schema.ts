
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type ContactDocument = HydratedDocument<Contact>;

@Schema()
export class Contact {
    // User who owns this contact (for multi-tenancy)
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId: mongoose.Types.ObjectId;

    @Prop()
    email: string;

    @Prop() 
    name: string;

    @Prop({ default: 'active' }) // active, unsubscribed, bounced
    status: string;

    @Prop()
    phone: string;

    @Prop({ type: Object })
    misc: Record<string, any>;

    @Prop()
    notes: string;

    @Prop()
    callbackDate: Date;

    @Prop()
    assignee: string;

    @Prop({ default: Date.now })
    dateAdded: Date;

    @Prop({ type: [String], default: [] })
    history: string[]; // List of Template IDs sent to this contact
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
