import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { Configuration } from '@config/configuration';

@Injectable()
export class MailerService {
    constructor(private _NestMailerService: NestMailerService) {}

    async sendMail(to: string): Promise<any> {
        return this._NestMailerService.sendMail({
            from: Configuration.instance.smtpAuth.user,
            to,
            subject: 'test',
            template: './verify-account',
            context: {
                email: to,
            },
        });
    }
}
