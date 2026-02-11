
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeamMember } from '../schemas/team.schema';

@Injectable()
export class TeamService {
    constructor(@InjectModel(TeamMember.name) private teamModel: Model<TeamMember>) { }

    async create(userId: string, createTeamDto: any): Promise<TeamMember> {
        const createdMember = new this.teamModel({ ...createTeamDto, userId });
        return createdMember.save();
    }

    async findAll(userId: string): Promise<TeamMember[]> {
        return this.teamModel.find({ userId }).exec();
    }

    async delete(userId: string, id: string): Promise<any> {
        return this.teamModel.findOneAndDelete({ _id: id, userId }).exec();
    }
}
