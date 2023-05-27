import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalAuthStrategy } from '@modules/auth/strategies/local-auth.strategy';
import { TokenModule } from '@modules/token/token.module';
import { MailerModule } from '@modules/mailer/mailer.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
    providers: [AuthService, LocalAuthStrategy],
    controllers: [AuthController],
    imports: [PassportModule, TokenModule, MailerModule, CqrsModule],
})
export class AuthModule {}
