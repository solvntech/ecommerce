import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from '@schemas/account.schema';
import { PassportModule } from '@nestjs/passport';
import { LocalAuthStrategy } from '@modules/account/strategies/local-auth.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    providers: [AccountService, LocalAuthStrategy],
    controllers: [AccountController],
    imports: [
        MongooseModule.forFeature([
            {
                name: Account.name,
                schema: AccountSchema,
            },
        ]),
        PassportModule,
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
export class AccountModule {}
