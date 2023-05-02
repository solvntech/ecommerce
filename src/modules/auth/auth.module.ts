import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalAuthStrategy } from '@modules/auth/strategies/local-auth.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '@modules/user/user.module';

@Module({
    providers: [AuthService, LocalAuthStrategy],
    controllers: [AuthController],
    imports: [
        PassportModule,
        UserModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                return {
                    secret: configService.get('secret'),
                    signOptions: { expiresIn: '3h' },
                };
            },
            inject: [ConfigService],
        }),
    ],
})
export class AuthModule {}
