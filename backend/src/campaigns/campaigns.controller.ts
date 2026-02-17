
import { Controller, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('campaigns')
@UseGuards(JwtAuthGuard) // Protect all routes
export class CampaignsController {
    constructor(private campaignsService: CampaignsService) { }

    @Get()
    async getAll(@Req() req, @Query('page') page?: string, @Query('limit') limit?: string) {
        const userId = req.user.userId;
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 20;
        return this.campaignsService.findAll(userId, pageNum, limitNum);
    }

    @Get(':id')
    async getOne(@Req() req, @Param('id') id: string) {
        const userId = req.user.userId;
        return this.campaignsService.findOne(userId, id);
    }
}
