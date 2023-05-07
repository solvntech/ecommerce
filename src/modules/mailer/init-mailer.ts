import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { Configuration } from '@config/configuration';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

export class InitMailer implements MailerOptionsFactory {
    createMailerOptions(): MailerOptions {
        return {
            transport: {
                host: Configuration.instance.smtpHost,
                auth: Configuration.instance.smtpAuth,
            },
            template: {
                dir: join(__dirname, 'templates'),
                adapter: new EjsAdapter(),
                options: {
                    strict: false,
                },
            },
        };
    }
}
