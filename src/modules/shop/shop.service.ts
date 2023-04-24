import { HttpStatus, Injectable } from '@nestjs/common';
import { AccountDto } from '@dto/account.dto';
import { ErrorDto } from '@dto/error.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Shop } from '@schemas/shop.schema';
import { Model } from 'mongoose';
import { SuccessDto } from '@dto/success.dto';

@Injectable()
export class ShopService {
    constructor(@InjectModel(Shop.name) private _ShopModel: Model<Shop>) {}

    async createShop(account: AccountDto) {
        try {
            const existAccount = await this._ShopModel.findOne({ email: account.email });
            if (existAccount) {
                return new ErrorDto('Duplicate account', HttpStatus.CONFLICT).error;
            }
            const newShop = await this._ShopModel.create(account);
            return new SuccessDto('Create shop successfully', HttpStatus.CREATED, newShop);
        } catch (e) {
            return new ErrorDto(e, HttpStatus.BAD_REQUEST).error;
        }
    }
}
