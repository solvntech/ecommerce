import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { InitMailer } from '@modules/mailer/init-mailer';

@Module({
    providers: [MailerService],
    imports: [
        NestMailerModule.forRootAsync({
            imports: [ConfigModule],
            useClass: InitMailer,
        }),
    ],
    exports: [MailerService],
})
export class MailerModule {}
