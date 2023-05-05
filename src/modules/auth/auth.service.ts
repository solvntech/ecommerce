import { HttpStatus, Injectable } from '@nestjs/common';
import { AccountDto } from '@dto/account.dto';
import { BcryptHelper } from '@helpers/bcrypt.helper';
import { LoggerServerHelper } from '@helpers/logger-server.helper';
import { UserDocument } from '@schemas/user.schema';
import { ErrorDto, SuccessDto, TError } from '@dto/core';
import { UserService } from '@modules/user/user.service';
import { TokenService } from '@modules/token/token.service';
import { JwtPayload } from '@types';

@Injectable()
export class AuthService {
    constructor(private _UserService: UserService, private _TokenService: TokenService) {}

    async createAccount(account: AccountDto): Promise<SuccessDto | TError> {
        try {
            const existAccount: UserDocument = await this._UserService.findUserByEmail(account.email);
            if (existAccount) {
                return new ErrorDto('Duplicate account', HttpStatus.CONFLICT).error;
            }
            account.password = await BcryptHelper.hashPassword(account.password);
            const newShop: UserDocument = await this._UserService.create(account);
            const tokenRes = await this.generationAuthResponse(newShop);

            if (tokenRes) {
                return new SuccessDto('Create account successfully', HttpStatus.CREATED, tokenRes);
            }
            return new ErrorDto('Create account successfully but create token failed', HttpStatus.INTERNAL_SERVER_ERROR)
                .error;
        } catch (e) {
            LoggerServerHelper.error(e.toString());
            return new ErrorDto('Create account failed', HttpStatus.BAD_REQUEST).error;
        }
    }

    async validateShop(email: string, password: string): Promise<SuccessDto | TError> {
        try {
            const currentAccount: UserDocument = await this._UserService.findUserByEmail(email);

            if (currentAccount) {
                if (await BcryptHelper.validatePassword(password, currentAccount.password)) {
                    const tokenRes = await this.generationAuthResponse(currentAccount);

                    if (tokenRes) {
                        return new SuccessDto('Login successfully', HttpStatus.OK, tokenRes);
                    }
                    return new ErrorDto('Create token failed', HttpStatus.INTERNAL_SERVER_ERROR).error;
                }
                return new ErrorDto('Email or password is incorrect', HttpStatus.BAD_REQUEST).error;
            }
            return new ErrorDto('Account has not existed', HttpStatus.BAD_REQUEST).error;
        } catch (e) {
            LoggerServerHelper.error(e.toString());
            return new ErrorDto('Login failed', HttpStatus.BAD_REQUEST).error;
        }
    }

    /* generate token response */
    private async generationAuthResponse(account: UserDocument): Promise<any> {
        const payload: JwtPayload = {
            id: account._id.toString(),
            role: account.roles,
            email: account.email,
        };

        try {
            // create jwt token
            const { accessToken, refreshToken } = await this._TokenService.generateToken(payload);

            return {
                ...payload,
                accessToken,
                refreshToken,
            };
        } catch (e) {
            LoggerServerHelper.error(e.toString());
            return null;
        }
    }
}
