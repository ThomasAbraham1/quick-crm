
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from '../schemas/contact.schema';

@Injectable()
export class ContactsService {
    constructor(@InjectModel(Contact.name) private contactModel: Model<Contact>) { }

    async create(createContactDto: { email: string; name: string }) {
        const contact = new this.contactModel(createContactDto);
        return contact.save();
    }

    async findAll() {
        return this.contactModel.find().sort({ _id: -1 }).exec(); // Newest first
    }

    async bulkCreate(contactsData: any[]) {
        const operations = contactsData.map(c => {
            // Known fields
            const { email, name, phone, notes, assignee, callbackDate, ...misc } = c;

            const updateData: any = { email, name };

            // Add optional known fields if present
            if (phone) updateData.phone = phone;
            if (notes) updateData.notes = notes;
            if (assignee) updateData.assignee = assignee;
            if (callbackDate) updateData.callbackDate = new Date(callbackDate);

            // Store extra fields in misc
            if (Object.keys(misc).length > 0) {
                updateData.misc = misc;
            }

            return {
                updateOne: {
                    filter: { email: email },
                    update: {
                        $set: updateData,
                        $setOnInsert: { dateAdded: new Date() }
                    },
                    upsert: true
                }
            };
        });
        return this.contactModel.bulkWrite(operations);
    }

    async update(id: string, updateData: any) {
        return this.contactModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    async delete(id: string) {
        return this.contactModel.findByIdAndDelete(id);
    }

    async bulkAssign(contactIds: string[], assignee: string) {
        return this.contactModel.updateMany(
            { _id: { $in: contactIds } },
            { $set: { assignee } }
        );
    }
}
