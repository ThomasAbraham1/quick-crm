
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Fix for ObjectId
const ObjectId = mongoose.Types.ObjectId;

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function reassign() {
    // CHANGE THIS TO THE ID YOU WANT TO ASSIGN DATA TO
    const TARGET_USER_ID = '698c060968c3246b816c5629'; // The ID you see in your debug logs

    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('❌ MONGODB_URI not found in .env');
        process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Connected.');

    try {
        const UserSchema = new mongoose.Schema({ email: String, googleId: String });
        const UserModel = mongoose.model('User', UserSchema);

        const user = await UserModel.findById(TARGET_USER_ID).exec();
        if (!user) {
            console.error(`❌ Target user ${TARGET_USER_ID} NOT FOUND in database!`);
            console.log('Please check the ID and try again.');
            process.exit(1);
        }

        console.log(`👤 Reassigning ALL data to: ${user.email} (ID: ${user._id})`);

        // 1. Update Contacts
        const ContactModel = mongoose.model('Contact', new mongoose.Schema({}, { strict: false }));
        await ContactModel.collection.updateMany({}, { $set: { userId: new ObjectId(TARGET_USER_ID) } });
        console.log(`✅ Assigned Records: Contacts`);

        // 2. Update Campaigns
        const CampaignModel = mongoose.model('Campaign', new mongoose.Schema({}, { strict: false }));
        await CampaignModel.collection.updateMany({}, { $set: { userId: new ObjectId(TARGET_USER_ID) } });
        console.log(`✅ Assigned Records: Campaigns`);

        // 3. Update Templates
        const TemplateModel = mongoose.model('Template', new mongoose.Schema({}, { strict: false }));
        await TemplateModel.collection.updateMany({}, { $set: { userId: new ObjectId(TARGET_USER_ID) } });
        console.log(`✅ Assigned Records: Templates`);

        // 4. Update TeamMembers
        const TeamModel = mongoose.model('TeamMember', new mongoose.Schema({}, { strict: false }));
        await TeamModel.collection.updateMany({}, { $set: { userId: new ObjectId(TARGET_USER_ID) } });
        console.log(`✅ Assigned Records: TeamMembers`);

        console.log('\n🎉 Reassignment Complete! All data is now owned by ' + user.email);
        console.log('Your backend should now correctly find this data for your logged-in user.');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

reassign();
