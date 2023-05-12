import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AccountDto } from '@dto/account.dto';
import { AuthService } from '@modules/auth/auth.service';
import { LocalAuthGuard } from '@modules/auth/guards/local-auth.guard';
import { JwtGuard } from '@modules/token/guards/jwt.guard';
import { HEADER_KEY } from '@constants';

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

    @UseGuards(JwtGuard)
    @Post('logout')
    logout(@Request() req) {
        const refreshToken = req.get(HEADER_KEY.REFRESH_TOKEN);
        return this._ShopAccountService.logout(refreshToken);
    }

    @Post('refresh-token')
    refreshToken(@Request() req) {
        const refreshToken = req.get(HEADER_KEY.REFRESH_TOKEN);
        return this._ShopAccountService.handleRefreshToken(refreshToken);
    }
}
