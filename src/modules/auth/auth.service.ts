import { HttpStatus, Injectable } from '@nestjs/common';
import { AccountDto } from '@dto/account.dto';
import { BcryptHelper } from '@helpers/bcrypt.helper';
import { LoggerServerHelper } from '@helpers/logger-server.helper';
import { UserDocument } from '@schemas/user.schema';
import { ErrorDto, SuccessDto, TError } from '@dto/core';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@modules/user/user.service';

@Injectable()
export class AuthService {
    constructor(private _JwtService: JwtService, private _UserService: UserService) {}

    async createAccount(account: AccountDto): Promise<SuccessDto | TError> {
        try {
            const existAccount: UserDocument = await this._UserService.findUserByEmail(account.email);
            if (existAccount) {
                return new ErrorDto('Duplicate account', HttpStatus.CONFLICT).error;
            }
            account.password = await BcryptHelper.hashPassword(account.password);
            const newShop: UserDocument = await this._UserService.create(account);
            return new SuccessDto(
                'Create account successfully',
                HttpStatus.CREATED,
                this.generationAuthResponse(newShop)
            );
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
                    return this.generationAuthResponse(currentAccount);
                }
                return new ErrorDto('Email or password is incorrect', HttpStatus.BAD_REQUEST).error;
            }
            return new ErrorDto('Account has not existed', HttpStatus.BAD_REQUEST).error;
        } catch (e) {
            LoggerServerHelper.error(e.toString());
            return new ErrorDto('Login failed', HttpStatus.BAD_REQUEST).error;
        }
    }

    private generationAuthResponse(account: UserDocument): SuccessDto {
        const payload = {
            id: account._id,
            role: account.roles,
            email: account.email,
        };
        return new SuccessDto('Login successfully', HttpStatus.OK, {
            ...payload,
            accessToken: this._JwtService.sign(payload),
        });
    }
}
