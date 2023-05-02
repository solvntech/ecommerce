import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '@modules/auth/auth.service';

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy) {
    constructor(private _ShopAccountService: AuthService) {
        super({
            usernameField: 'email',
        });
    }

    validate(username: string, password: string): Promise<any> {
        return this._ShopAccountService.validateShop(username, password);
    }
}
