import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ShopAccountService } from '@modules/shop-account/shop-account.service';

@Injectable()
export class ShopAuthStrategy extends PassportStrategy(Strategy) {
    constructor(private _ShopAccountService: ShopAccountService) {
        super({
            usernameField: 'email',
        });
    }

    validate(username: string, password: string): Promise<any> {
        return this._ShopAccountService.validateShop(username, password);
    }
}
