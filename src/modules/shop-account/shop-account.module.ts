import { Module } from '@nestjs/common';
import { ShopAccountService } from './shop-account.service';
import { ShopAccountController } from './shop-account.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopAccount, ShopAccountSchema } from '@schemas/shop-account.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: ShopAccount.name,
                schema: ShopAccountSchema,
            },
        ]),
    ],
    providers: [ShopAccountService],
    controllers: [ShopAccountController],
})
export class ShopAccountModule {}
