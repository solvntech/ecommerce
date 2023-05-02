import { HttpStatus, Injectable } from '@nestjs/common';
import { AccountDto } from '@dto/account.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BcryptHelper } from '@helpers/bcrypt.helper';
import { plainToClass } from 'class-transformer';
import { LoggerServerHelper } from '@helpers/logger-server.helper';
import { Account, AccountDocument } from '@schemas/account.schema';
import { ErrorDto, SuccessDto, TError } from '@dto/core';
import { AccountResponseDto } from '@dto/account-response.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccountService {
    constructor(@InjectModel(Account.name) private _AccountModel: Model<Account>, private _JwtService: JwtService) {}

    async createAccount(account: AccountDto): Promise<SuccessDto | TError> {
        try {
            const existAccount = await this._AccountModel.findOne({ email: account.email });
            if (existAccount) {
                return new ErrorDto('Duplicate account', HttpStatus.CONFLICT).error;
            }
            account.password = await BcryptHelper.hashPassword(account.password);
            const newShop: AccountDocument = await this._AccountModel.create(account);
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

    async findAllAccount(): Promise<SuccessDto | TError> {
        try {
            const account: AccountDocument = await this._AccountModel.find().lean();
            return new SuccessDto(
                'Find all accounts successfully',
                HttpStatus.CREATED,
                plainToClass(AccountResponseDto, account)
            );
        } catch (e) {
            return new ErrorDto(e, HttpStatus.BAD_REQUEST).error;
        }
    }

    async validateShop(email: string, password: string): Promise<SuccessDto | TError> {
        try {
            const currentAccount: AccountDocument = await this._AccountModel.findOne({ email: email }).lean();

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

    private generationAuthResponse(account: AccountDocument): SuccessDto {
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
