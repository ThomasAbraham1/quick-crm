
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('templates')
@UseGuards(JwtAuthGuard) // Protect all routes
export class TemplatesController {
    constructor(private readonly templatesService: TemplatesService) { }

    @Post()
    create(@Req() req, @Body() body: { subject: string; body: string }) {
        const userId = req.user.userId;
        return this.templatesService.create(userId, body);
    }

    @Get()
    findAll(@Req() req) {
        const userId = req.user.userId;
        return this.templatesService.findAll(userId);
    }

    @Get(':id')
    findOne(@Req() req, @Param('id') id: string) {
        const userId = req.user.userId;
        return this.templatesService.findOne(userId, id);
    }

    @Put(':id')
    update(@Req() req, @Param('id') id: string, @Body() body: { subject?: string; body?: string }) {
        const userId = req.user.userId;
        return this.templatesService.update(userId, id, body);
    }

    @Delete(':id')
    remove(@Req() req, @Param('id') id: string) {
        const userId = req.user.userId;
        return this.templatesService.remove(userId, id);
    }
}
