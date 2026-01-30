
import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { ContactsService } from './contacts.service';

@Controller('contacts')
export class ContactsController {
    constructor(private readonly contactsService: ContactsService) { }

    @Post()
    create(@Body() body: { email: string; name: string }) {
        return this.contactsService.create(body);
    }

    @Post('import')
    bulkImport(@Body() body: { contacts: { email: string; name: string }[] }) {
        return this.contactsService.bulkCreate(body.contacts);
    }

    @Get()
    findAll() {
        return this.contactsService.findAll();
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.contactsService.delete(id);
    }
}
