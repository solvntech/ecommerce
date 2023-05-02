import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AccountDto } from '@dto/account.dto';
import { AccountService } from '@modules/account/account.service';
import { LocalAuthGuard } from '@modules/account/guards/local-auth.guard';

@Controller()
export class AccountController {
    constructor(private _ShopAccountService: AccountService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Request() req) {
        return req.user;
    }

    @Post('register')
    registerAccount(@Body() account: AccountDto) {
        return this._ShopAccountService.createAccount(account);
    }

    @Get('all-accounts')
    findAllShopAccount() {
        return this._ShopAccountService.findAllAccount();
    }
}
