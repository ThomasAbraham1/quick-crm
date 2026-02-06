
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeamMember } from '../schemas/team.schema';

@Injectable()
export class TeamService {
    constructor(@InjectModel(TeamMember.name) private teamModel: Model<TeamMember>) { }

    async create(createTeamDto: any): Promise<TeamMember> {
        const createdMember = new this.teamModel(createTeamDto);
        return createdMember.save();
    }

    async findAll(): Promise<TeamMember[]> {
        return this.teamModel.find().exec();
    }

    async delete(id: string): Promise<any> {
        return this.teamModel.findByIdAndDelete(id).exec();
    }
}
