import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AccountService } from '@modules/account/account.service';

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy) {
    constructor(private _ShopAccountService: AccountService) {
        super({
            usernameField: 'email',
        });
    }

    validate(username: string, password: string): Promise<any> {
        return this._ShopAccountService.validateShop(username, password);
    }
}
