import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { MailController } from './mail.controller';
import { MailProcessor } from './mail.processor';
import { Contact, ContactSchema } from '../schemas/contact.schema';
import { Template, TemplateSchema } from '../schemas/template.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { TrackingController } from './mail.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Contact.name, schema: ContactSchema },
            { name: Template.name, schema: TemplateSchema },
        ]),
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                connection: {
                    host: configService.get('REDIS_HOST'),
                    port: +configService.get('REDIS_PORT'),
                    password: configService.get('REDIS_PASSWORD'),
                },
            }),
            inject: [ConfigService],
        }),
        BullModule.registerQueue({
            name: 'email-queue',
            defaultJobOptions: {
                removeOnComplete: true, // Auto-remove successful jobs
                removeOnFail: 1000,     // Keep last 1000 failed jobs for debugging
            },
        }),
        CampaignsModule,
    ],
    controllers: [MailController, TrackingController],
    providers: [MailProcessor],
})
export class MailModule { }
