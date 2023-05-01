import { Module } from '@nestjs/common';
import { ShopAccountService } from './shop-account.service';
import { ShopAccountController } from './shop-account.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopAccount, ShopAccountSchema } from '@schemas/shop-account.schema';
import { PassportModule } from '@nestjs/passport';
import { ShopAuthStrategy } from '@modules/shop-account/strategies/shop-auth.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    providers: [ShopAccountService, ShopAuthStrategy],
    controllers: [ShopAccountController],
    imports: [
        MongooseModule.forFeature([
            {
                name: ShopAccount.name,
                schema: ShopAccountSchema,
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
export class ShopAccountModule {}
