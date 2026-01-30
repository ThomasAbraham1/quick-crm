
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { TemplatesService } from './templates.service';

@Controller('templates')
export class TemplatesController {
    constructor(private readonly templatesService: TemplatesService) { }

    @Post()
    create(@Body() body: { subject: string; body: string }) {
        return this.templatesService.create(body);
    }

    @Get()
    findAll() {
        return this.templatesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.templatesService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() body: { subject?: string; body?: string }) {
        return this.templatesService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.templatesService.remove(id);
    }
}
