
import { Controller, Get, Post, Put, Body, Delete, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('contacts')
@UseGuards(JwtAuthGuard) // Protect all routes - requires authentication
export class ContactsController {
    constructor(private readonly contactsService: ContactsService) { }

    @Post()
    create(@Req() req, @Body() body: { email: string; name: string }) {
        const userId = req.user.userId; // Extract from JWT token
        return this.contactsService.create(userId, body);
    }

    @Post('import')
    bulkImport(@Req() req, @Body() body: { contacts: { email: string; name: string }[] }) {
        const userId = req.user.userId;
        return this.contactsService.bulkCreate(userId, body.contacts);
    }

    @Get()
    findAll(@Req() req, @Query('page') page?: string, @Query('limit') limit?: string) {
        const userId = req.user.userId;
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 20;
        return this.contactsService.findAll(userId, pageNum, limitNum);
    }

    @Put('bulk-assign')
    bulkAssign(@Req() req, @Body() body: { contactIds: string[]; assignee: string }) {
        const userId = req.user.userId;
        return this.contactsService.bulkAssign(userId, body.contactIds, body.assignee);
    }

    @Put(':id')
    update(@Req() req, @Param('id') id: string, @Body() updateData: any) {
        const userId = req.user.userId;
        console.log(updateData)
        return this.contactsService.update(userId, id, updateData);
    }

    @Delete(':id')
    delete(@Req() req, @Param('id') id: string) {
        const userId = req.user.userId;
        return this.contactsService.delete(userId, id);
    }
}


