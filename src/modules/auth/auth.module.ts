import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalAuthStrategy } from '@modules/auth/strategies/local-auth.strategy';
import { UserModule } from '@modules/user/user.module';
import { TokenModule } from '@modules/token/token.module';

@Module({
    providers: [AuthService, LocalAuthStrategy],
    controllers: [AuthController],
    imports: [PassportModule, UserModule, TokenModule],
})
export class AuthModule {}
