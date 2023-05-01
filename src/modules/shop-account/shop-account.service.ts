import { HttpStatus, Injectable } from '@nestjs/common';
import { AccountDto } from '@dto/core/account.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BcryptHelper } from '@helpers/bcrypt.helper';
import { plainToClass } from 'class-transformer';
import { LoggerServerHelper } from '@helpers/logger-server.helper';
import { ShopAccount, ShopAccountDocument } from '@schemas/shop-account.schema';
import { ErrorDto, SuccessDto, TError } from '@dto/core';
import { ShopAccountDto } from '@dto/shop-account.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ShopAccountService {
    constructor(
        @InjectModel(ShopAccount.name) private _ShopAccountModel: Model<ShopAccount>,
        private _JwtService: JwtService
    ) {}

    async createShopAccount(account: AccountDto): Promise<SuccessDto | TError> {
        try {
            const existAccount = await this._ShopAccountModel.findOne({ email: account.email });
            if (existAccount) {
                return new ErrorDto('Duplicate shop-account', HttpStatus.CONFLICT).error;
            }
            account.password = await BcryptHelper.hashPassword(account.password);
            const newShop: ShopAccountDocument = await this._ShopAccountModel.create(account);
            return new SuccessDto(
                'Create shop-account successfully',
                HttpStatus.CREATED,
                this.generationAuthResponse(newShop)
            );
        } catch (e) {
            LoggerServerHelper.error(e.toString());
            return new ErrorDto('Create shop-account failed', HttpStatus.BAD_REQUEST).error;
        }
    }

    async findAllAccount(): Promise<SuccessDto | TError> {
        try {
            const shops = await this._ShopAccountModel.find().lean();
            return new SuccessDto(
                'Find all shops successfully',
                HttpStatus.CREATED,
                plainToClass(ShopAccountDto, shops)
            );
        } catch (e) {
            return new ErrorDto(e, HttpStatus.BAD_REQUEST).error;
        }
    }

    async validateShop(email: string, password: string): Promise<SuccessDto | TError> {
        try {
            const currentShop: ShopAccountDocument = await this._ShopAccountModel.findOne({ email: email });

            if (currentShop) {
                if (await BcryptHelper.validatePassword(password, currentShop.password)) {
                    return this.generationAuthResponse(currentShop);
                }
                return new ErrorDto('Email or password is incorrect', HttpStatus.BAD_REQUEST).error;
            }
            return new ErrorDto('Account has not existed', HttpStatus.BAD_REQUEST).error;
        } catch (e) {
            LoggerServerHelper.error(e.toString());
            return new ErrorDto('Login failed', HttpStatus.BAD_REQUEST).error;
        }
    }

    private generationAuthResponse(account: ShopAccountDocument): SuccessDto {
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
