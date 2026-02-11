
import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('campaigns')
@UseGuards(JwtAuthGuard) // Protect all routes
export class CampaignsController {
    constructor(private campaignsService: CampaignsService) { }

    @Get()
    async getAll(@Req() req) {
        const userId = req.user.userId;
        return this.campaignsService.findAll(userId);
    }

    @Get(':id')
    async getOne(@Req() req, @Param('id') id: string) {
        const userId = req.user.userId;
        return this.campaignsService.findOne(userId, id);
    }
}
