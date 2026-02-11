
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type TeamMemberDocument = HydratedDocument<TeamMember>;

@Schema()
export class TeamMember {
    // User who owns this team member (for multi-tenancy)
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId: mongoose.Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ default: 'member' }) // admin, member
    role: string;

    @Prop({ default: Date.now })
    dateAdded: Date;
}

export const TeamMemberSchema = SchemaFactory.createForClass(TeamMember);
