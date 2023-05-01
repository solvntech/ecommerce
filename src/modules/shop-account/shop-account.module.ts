import { Module } from '@nestjs/common';
import { ShopAccountService } from './shop-account.service';
import { ShopAccountController } from './shop-account.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopAccount, ShopAccountSchema } from '@schemas/shop-account.schema';
import { PassportModule } from '@nestjs/passport';
import { ShopAuthStrategy } from '@modules/shop-account/strategies/shop-auth.strategy';

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
    ],
})
export class ShopAccountModule {}
