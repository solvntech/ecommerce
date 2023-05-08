import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AccountDto } from '@dto/account.dto';
import { AuthService } from '@modules/auth/auth.service';
import { LocalAuthGuard } from '@modules/auth/guards/local-auth.guard';
import { LogoutDto } from '@dto/logout.dto';

@Controller()
export class AuthController {
    constructor(private _ShopAccountService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Request() req) {
        return req.user;
    }

    @Post('register')
    register(@Body() account: AccountDto) {
        return this._ShopAccountService.createAccount(account);
    }

    @Post('logout')
    logout(@Body() secretObj: LogoutDto) {
        return this._ShopAccountService.logout(secretObj.refreshToken);
    }
}
