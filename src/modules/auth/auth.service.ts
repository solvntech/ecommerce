import { HttpStatus, Injectable } from '@nestjs/common';
import { AccountDto } from '@dto/account.dto';
import { BcryptHelper } from '@helpers/bcrypt.helper';
import { UserDocument } from '@schemas/user.schema';
import { ErrorDto, SuccessDto } from '@dto/core';
import { UserService } from '@modules/user/user.service';
import { TokenService } from '@modules/token/token.service';
import { JwtPayload } from '@types';
import { MailerService } from '@modules/mailer/mailer.service';

@Injectable()
export class AuthService {
    constructor(
        private _UserService: UserService,
        private _TokenService: TokenService,
        private _MailerService: MailerService,
    ) {}

    async createAccount(account: AccountDto): Promise<SuccessDto> {
        const existAccount: UserDocument = await this._UserService.findUserByEmail(account.email);
        if (existAccount) {
            throw new ErrorDto('Duplicate account', HttpStatus.CONFLICT);
        }
        account.password = await BcryptHelper.hashPassword(account.password);
        const newShop: UserDocument = await this._UserService.create(account);
        const tokenRes = await this.generationAuthResponse(newShop);

        if (tokenRes) {
            return new SuccessDto('Create account successfully', HttpStatus.CREATED, tokenRes);
        }
        throw new ErrorDto('Create account successfully but create token failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    async validateUser(email: string, password: string): Promise<SuccessDto> {
        const currentAccount: UserDocument = await this._UserService.findUserByEmail(email);
        if (currentAccount) {
            if (await BcryptHelper.validatePassword(password, currentAccount.password)) {
                const tokenRes = await this.generationAuthResponse(currentAccount);

                if (tokenRes) {
                    return new SuccessDto('Login successfully', HttpStatus.OK, tokenRes);
                }
                throw new ErrorDto('Generate token failed', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        throw new ErrorDto('Email or password is incorrect', HttpStatus.BAD_REQUEST);
    }

    /* generate token response */
    private async generationAuthResponse(account: UserDocument): Promise<any> {
        const payload: JwtPayload = {
            id: account._id.toString(),
            role: account.roles,
            email: account.email,
        };

        // create jwt token
        const { accessToken, refreshToken } = await this._TokenService.generateToken(payload);

        return {
            ...payload,
            accessToken,
            refreshToken,
        };
    }
}
