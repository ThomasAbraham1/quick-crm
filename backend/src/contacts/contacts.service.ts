
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
            const { email, name, phone, ...others } = c;
            return {
                updateOne: {
                    filter: { email: email },
                    update: {
                        $set: {
                            email,
                            name,
                            phone,
                            otherInfo: others
                        },
                        $setOnInsert: { dateAdded: new Date() }
                    },
                    upsert: true
                }
            };
        });
        return this.contactModel.bulkWrite(operations);
    }

    async delete(id: string) {
        return this.contactModel.findByIdAndDelete(id);
    }
}
