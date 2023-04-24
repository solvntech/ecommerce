import { Body, Controller, Post } from '@nestjs/common';
import { AccountDto } from '@dto/account.dto';
import { ShopService } from '@modules/shop/shop.service';

@Controller()
export class ShopController {
    constructor(private _ShopService: ShopService) {}

    @Post('signup')
    signup(@Body() account: AccountDto) {
        return this._ShopService.createShop(account);
    }
}
