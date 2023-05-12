import { HttpStatus, Injectable } from '@nestjs/common';
import { AccountDto } from '@dto/account.dto';
import { BcryptHelper } from '@helpers/bcrypt.helper';
import { UserDocument } from '@schemas/user.schema';
import { ErrorDto, SuccessDto } from '@dto/core';
import { UserService } from '@modules/user/user.service';
import { TokenService } from '@modules/token/token.service';
import { JwtPayload, PairSecretToken } from '@types';
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
        const user: UserDocument = await this._UserService.create(account);

        const payload: JwtPayload = {
            id: user._id.toString(),
            role: user.roles,
            email: user.email,
        };

        // create jwt token
        const tokenObj: PairSecretToken = await this._TokenService.generateToken(payload);

        if (tokenObj) {
            return new SuccessDto('Create account successfully', HttpStatus.CREATED, {
                ...payload,
                ...tokenObj,
            });
        }
        throw new ErrorDto('Create account successfully but create token failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    async validateUser(email: string, password: string): Promise<SuccessDto> {
        const currentAccount: UserDocument = await this._UserService.findUserByEmail(email);
        if (currentAccount) {
            if (await BcryptHelper.validatePassword(password, currentAccount.password)) {
                const payload: JwtPayload = {
                    id: currentAccount._id.toString(),
                    role: currentAccount.roles,
                    email: currentAccount.email,
                };

                // create jwt token
                const tokenObj: PairSecretToken = await this._TokenService.generateToken(payload);

                if (tokenObj) {
                    return new SuccessDto('Login successfully', HttpStatus.OK, {
                        ...payload,
                        ...tokenObj,
                    });
                }
                throw new ErrorDto('Account is logged', HttpStatus.CONFLICT);
            }
        }
        throw new ErrorDto('Email or password is incorrect', HttpStatus.BAD_REQUEST);
    }

    async logout(refreshToken: string): Promise<SuccessDto> {
        const isSuccess: boolean = await this._TokenService.removeToken(refreshToken);
        if (isSuccess) {
            return new SuccessDto('Logout successfully');
        }
        throw new ErrorDto('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
}
