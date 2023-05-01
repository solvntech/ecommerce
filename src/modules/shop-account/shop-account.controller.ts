import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AccountDto } from '@dto/core';
import { ShopAccountService } from '@modules/shop-account/shop-account.service';
import { ShopAuthGuard } from '@modules/shop-account/guards/shop-auth.guard';

@Controller()
export class ShopAccountController {
    constructor(private _ShopAccountService: ShopAccountService) {}

    @UseGuards(ShopAuthGuard)
    @Post('login')
    login(@Request() req) {
        return req.user;
    }

    @Post('register')
    registerAccount(@Body() account: AccountDto) {
        return this._ShopAccountService.createShopAccount(account);
    }

    @Get('')
    findAllShopAccount() {
        return this._ShopAccountService.findAllAccount();
    }
}
