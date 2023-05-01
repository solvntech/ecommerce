import { Body, Controller, Get, Post } from '@nestjs/common';
import { AccountDto } from '@dto/core';
import { ShopAccountService } from '@modules/shop-account/shop-account.service';

@Controller()
export class ShopAccountController {
    constructor(private _ShopService: ShopAccountService) {}

    @Post('register')
    registerAccount(@Body() account: AccountDto) {
        return this._ShopService.createShopAccount(account);
    }

    @Get('')
    findAllShopAccount() {
        return this._ShopService.findAllAccount();
    }
}
