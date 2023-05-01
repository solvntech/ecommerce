import { HttpStatus, Injectable } from '@nestjs/common';
import { AccountDto } from '@dto/core/account.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BcryptHelper } from '@helpers/bcrypt.helper';
import { plainToClass } from 'class-transformer';
import { LoggerServerHelper } from '@helpers/logger-server.helper';
import { ShopAccount } from '@schemas/shop-account.schema';
import { ErrorDto, SuccessDto, TError } from '@dto/core';
import { ShopAccountDto } from '@dto/shop-account.dto';

@Injectable()
export class ShopAccountService {
    constructor(@InjectModel(ShopAccount.name) private _ShopAccountModel: Model<ShopAccount>) {}

    async createShopAccount(account: AccountDto): Promise<SuccessDto | TError> {
        try {
            const existAccount = await this._ShopAccountModel.findOne({ email: account.email });
            if (existAccount) {
                return new ErrorDto('Duplicate shop-account', HttpStatus.CONFLICT).error;
            }
            account.password = await BcryptHelper.hashPassword(account.password);
            const newShop = await this._ShopAccountModel.create(account);
            // return new SuccessDto('Create shop-account successfully', HttpStatus.CREATED, new ShopAccount(newShop));
        } catch (e) {
            LoggerServerHelper.error(e.toString());
            return new ErrorDto('Create shop-account failed', HttpStatus.BAD_REQUEST).error;
        }
    }

    async findAllAccount(): Promise<SuccessDto | TError> {
        try {
            const shops = await this._ShopAccountModel.find().lean();
            console.log(plainToClass(ShopAccountDto, shops));
            return new SuccessDto(
                'Find all shops successfully',
                HttpStatus.CREATED,
                plainToClass(ShopAccountDto, shops)
            );
        } catch (e) {
            return new ErrorDto(e, HttpStatus.BAD_REQUEST).error;
        }
    }
}
