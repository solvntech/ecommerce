import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@schemas/user.schema';
import { Model } from 'mongoose';
import { SuccessDto, TError } from '@dto/core';
import { plainToClass } from 'class-transformer';
import { UserDto } from '@dto/user.dto';
import { AccountDto } from '@dto/account.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private _UserModel: Model<User>) {}

    async findAll(): Promise<SuccessDto | TError> {
        const users: UserDocument = await this._UserModel.find().lean();
        return new SuccessDto(null, HttpStatus.OK, plainToClass(UserDto, users));
    }

    async findUserByEmail(email: string): Promise<UserDocument> {
        return this._UserModel.findOne({ email: email }).lean();
    }

    async create(user: AccountDto): Promise<UserDocument> {
        return this._UserModel.create(user);
    }
}
