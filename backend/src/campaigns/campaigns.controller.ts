
import { Controller, Get, Param } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';

@Controller('campaigns')
export class CampaignsController {
    constructor(private campaignsService: CampaignsService) { }

    @Get()
    async getAll() {
        return this.campaignsService.findAll();
    }

    @Get(':id')
    async getOne(@Param('id') id: string) {
        return this.campaignsService.findOne(id);
    }
}
