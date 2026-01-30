
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Template } from '../schemas/template.schema';

@Injectable()
export class TemplatesService {
    constructor(@InjectModel(Template.name) private templateModel: Model<Template>) { }

    async create(createTemplateDto: { subject: string; body: string }) {
        const createdTemplate = new this.templateModel(createTemplateDto);
        return createdTemplate.save();
    }

    async findAll() {
        return this.templateModel.find().exec();
    }

    async findOne(id: string) {
        return this.templateModel.findById(id).exec();
    }

    async update(id: string, updateTemplateDto: { subject?: string; body?: string }) {
        return this.templateModel.findByIdAndUpdate(id, updateTemplateDto, { new: true }).exec();
    }

    async remove(id: string) {
        return this.templateModel.findByIdAndDelete(id).exec();
    }
}
