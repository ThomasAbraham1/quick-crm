import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Contact } from '../schemas/contact.schema';

@Injectable()
export class ContactsService {
    constructor(@InjectModel(Contact.name) private contactModel: Model<Contact>) { }

    async create(userId: string, createContactDto: { email: string; name: string }) {
        const contact = new this.contactModel({ ...createContactDto, userId });
        return contact.save();
    }

    async findAll(userId: string, page: number = 1, limit: number = 20) {
        // Ensure page is at least 1
        page = Math.max(1, page);
        limit = Math.max(1, Math.min(100, limit)); // Max 100 items per page

        const skip = (page - 1) * limit;

        // Get total count for pagination
        const total = await this.contactModel.countDocuments({ userId }).exec();

        // Get paginated data
        const data = await this.contactModel
            .find({ userId })
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit)
            .exec();

        return {
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        };
    }

    async bulkCreate(userId: string, contactsData: any[]) {
        // Separate contacts with and without emails
        const withEmail = contactsData.filter(c => c.email);
        const withoutEmail = contactsData.filter(c => !c.email);

        const results: any = {
            upserted: 0,
            inserted: 0,
            modified: 0
        };

        // Convert userId to ObjectId for MongoDB filter
        const userObjectId = new Types.ObjectId(userId);

        // Handle contacts with email (upsert based on email)
        if (withEmail.length > 0) {
            const operations = withEmail.map(c => {
                const { email, name, phone, notes, assignee, callbackDate, ...misc } = c;
                const updateData: any = { email, name, userId: userObjectId };

                if (phone) updateData.phone = phone;
                if (notes) updateData.notes = notes;
                if (assignee) updateData.assignee = assignee;
                if (callbackDate) updateData.callbackDate = new Date(callbackDate);
                if (Object.keys(misc).length > 0) {
                    updateData.misc = misc;
                }

                return {
                    updateOne: {
                        filter: { email: email, userId: userObjectId },
                        update: {
                            $set: updateData,
                            $setOnInsert: { dateAdded: new Date() }
                        },
                        upsert: true
                    }
                };
            });
            const bulkResult = await this.contactModel.bulkWrite(operations);
            results.upserted += bulkResult.upsertedCount || 0;
            results.modified += bulkResult.modifiedCount || 0;
        }

        // Handle contacts without email (always insert)
        if (withoutEmail.length > 0) {
            const newContacts = withoutEmail.map(c => {
                const { email, name, phone, notes, assignee, callbackDate, ...misc } = c;
                const contactData: any = { name, userId };

                if (phone) contactData.phone = phone;
                if (notes) contactData.notes = notes;
                if (assignee) contactData.assignee = assignee;
                if (callbackDate) contactData.callbackDate = new Date(callbackDate);

                if (Object.keys(misc).length > 0) {
                    contactData.misc = misc;
                }

                contactData.dateAdded = new Date();
                return contactData;
            });
            const insertResult = await this.contactModel.insertMany(newContacts);
            results.inserted += insertResult.length;
        }

        return results;
    }

    async update(userId: string, id: string, updateData: any) {
        return this.contactModel.findOneAndUpdate({ _id: id, userId }, updateData, { new: true }).exec();
    }

    async delete(userId: string, id: string) {
        return this.contactModel.findOneAndDelete({ _id: id, userId });
    }

    async bulkAssign(userId: string, contactIds: string[], assignee: string) {
        return this.contactModel.updateMany(
            { _id: { $in: contactIds }, userId },
            { $set: { assignee } }
        );
    }
}
