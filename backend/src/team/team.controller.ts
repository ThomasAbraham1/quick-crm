
import { Controller, Get, Post, Body, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { TeamService } from './team.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('team')
@UseGuards(JwtAuthGuard) // Protect all routes
export class TeamController {
    constructor(private readonly teamService: TeamService) { }

    @Post()
    create(@Req() req, @Body() createTeamDto: any) {
        const userId = req.user.userId;
        return this.teamService.create(userId, createTeamDto);
    }

    @Get()
    findAll(@Req() req) {
        const userId = req.user.userId;
        return this.teamService.findAll(userId);
    }

    @Delete(':id')
    delete(@Req() req, @Param('id') id: string) {
        const userId = req.user.userId;
        return this.teamService.delete(userId, id);
    }
}
