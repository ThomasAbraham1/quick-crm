
import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { TeamService } from './team.service';

@Controller('team')
export class TeamController {
    constructor(private readonly teamService: TeamService) { }

    @Post()
    create(@Body() createTeamDto: any) {
        return this.teamService.create(createTeamDto);
    }

    @Get()
    findAll() {
        return this.teamService.findAll();
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.teamService.delete(id);
    }
}
