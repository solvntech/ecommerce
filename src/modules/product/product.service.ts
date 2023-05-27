import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from '@schemas/product';
import { Model } from 'mongoose';
import { ProductDto, ProductResDto } from '@dto/product';
import { plainToClass } from 'class-transformer';
import { ErrorDto, SuccessDto } from '@dto/core';
import { UserDocument } from '@schemas/user.schema';
import { ProductDetailsService } from '@modules/product/product-details.service';
import * as _ from 'lodash';
import { CommandBus } from '@nestjs/cqrs';
import { FindUserByCommand } from '@modules/user/commands';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private _ProductModel: Model<Product>,
        private _CommandBus: CommandBus,
        private _ProductDetailsService: ProductDetailsService,
    ) {}

    async findAllProduct(): Promise<SuccessDto> {
        const products: ProductDocument = await this._ProductModel.find().populate('shop').lean();
        return new SuccessDto(null, HttpStatus.OK, plainToClass(ProductResDto, products));
    }

    async createProduct(product: ProductDto): Promise<SuccessDto> {
        const productDetails = await this._ProductDetailsService.create(product.attributes);
        const shop: UserDocument = await this._CommandBus.execute(new FindUserByCommand({ id: product.shop }));

        if (!shop) {
            throw new ErrorDto('Shop is incorrect', HttpStatus.NOT_FOUND);
        }

        const productPayload = plainToClass(Product, product);

        productPayload['_id'] = productDetails._id;
        productPayload.type = product.attributes.type;
        productPayload.attributes = _.map(
            _.filter(_.keys(product.attributes), (key) => !_.includes(['_id', '__v', 'type'], key)),
            (key) => ({ key, value: productDetails[key] }),
        );

        const newProduct: ProductDocument = await this._ProductModel.create(productPayload);
        return new SuccessDto('Create product successfully', HttpStatus.CREATED, newProduct);
    }
}
