
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Contact } from '../schemas/contact.schema';
import { Campaign } from '../schemas/campaign.schema';
import { Template } from '../schemas/template.schema';
import { TeamMember } from '../schemas/team.schema';
import { User } from '../schemas/user.schema';
import { Module, Controller, Post, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

// 1. Define a standalone module for migration to avoid huge dependency graph if possible, 
// but easier to just use the main AppModule context or connect manually.
// Let's connect manually to be script-like and avoid NestJS bootstrap complexity for a simple script.

import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function migrate() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('❌ MONGODB_URI not found in .env');
        process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Connected.');

    try {
        // Define bare-bones schemas/models just for migration to avoid NestJS DI
        const UserSchema = new mongoose.Schema({ email: String, googleId: String });
        const UserModel = mongoose.model('User', UserSchema);

        // Find the owner user
        const user = await UserModel.findOne().exec();
        if (!user) {
            console.error('❌ No users found in database! Please login via Google at least once to create a user.');
            process.exit(1);
        }

        const userId = user._id;
        console.log(`👤 Found Target User: ${user.email} (ID: ${userId})`);
        console.log('Assigning all data to this user...');

        // 1. Update Contacts
        const ContactModel = mongoose.model('Contact', new mongoose.Schema({}, { strict: false }));
        const contactResult = await ContactModel.updateMany(
            {},
            { $set: { userId: userId } } // Mongoose handles casting to ObjectId if schema was present, but here we are raw.
            // Actually, updateMany with strict: false and raw model might save as ObjectId if passed as ObjectId
        );
        // Ensure explicit ObjectId
        await ContactModel.collection.updateMany({}, { $set: { userId: new mongoose.Types.ObjectId(userId.toString()) } });
        console.log(`✅ Assigned Records: Contacts`);

        // 2. Update Campaigns
        const CampaignModel = mongoose.model('Campaign', new mongoose.Schema({}, { strict: false }));
        await CampaignModel.collection.updateMany({}, { $set: { userId: new mongoose.Types.ObjectId(userId.toString()) } });
        console.log(`✅ Assigned Records: Campaigns`);

        // 3. Update Templates
        const TemplateModel = mongoose.model('Template', new mongoose.Schema({}, { strict: false }));
        await TemplateModel.collection.updateMany({}, { $set: { userId: new mongoose.Types.ObjectId(userId.toString()) } });
        console.log(`✅ Assigned Records: Templates`);

        // 4. Update TeamMembers
        const TeamModel = mongoose.model('TeamMember', new mongoose.Schema({}, { strict: false }));
        await TeamModel.collection.updateMany({}, { $set: { userId: new mongoose.Types.ObjectId(userId.toString()) } });
        console.log(`✅ Assigned Records: TeamMembers`);

        console.log('\n🎉 Migration Complete! All data is now owned by ' + user.email);
        console.log('You can now restart the backend and access your data.');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

migrate();
