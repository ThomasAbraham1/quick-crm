
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Template } from '../schemas/template.schema';

@Injectable()
export class TemplatesService {
    constructor(@InjectModel(Template.name) private templateModel: Model<Template>) { }

    async create(userId: string, createTemplateDto: { subject: string; body: string }) {
        const createdTemplate = new this.templateModel({ ...createTemplateDto, userId });
        return createdTemplate.save();
    }

    async findAll(userId: string) {
        return this.templateModel.find({ userId }).exec();
    }

    async findOne(userId: string, id: string) {
        return this.templateModel.findOne({ _id: id, userId }).exec();
    }

    async update(userId: string, id: string, updateTemplateDto: { subject?: string; body?: string }) {
        return this.templateModel.findOneAndUpdate({ _id: id, userId }, updateTemplateDto, { new: true }).exec();
    }

    async remove(userId: string, id: string) {
        return this.templateModel.findOneAndDelete({ _id: id, userId }).exec();
    }
}
