
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ required: true, unique: true })
    googleId: string;

    @Prop({ required: true })
    email: string;

    @Prop()
    name: string;

    @Prop()
    picture: string;

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
