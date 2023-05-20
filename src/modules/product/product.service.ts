import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from '@schemas/product';
import { Model } from 'mongoose';
import { ProductDto, ProductResDto } from '@dto/product';
import { plainToClass } from 'class-transformer';
import { ErrorDto, SuccessDto } from '@dto/core';
import { UserService } from '@modules/user/user.service';
import { UserDocument } from '@schemas/user.schema';
import { ProductDetailsService } from '@modules/product/product-details.service';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private _ProductModel: Model<Product>,
        private _UserService: UserService,
        private _ProductDetailsService: ProductDetailsService,
    ) {}

    async findAllProduct(): Promise<SuccessDto> {
        const products: ProductDocument = await this._ProductModel.find().populate('shop').lean();
        return new SuccessDto(null, HttpStatus.OK, plainToClass(ProductResDto, products));
    }

    async createProduct(product: ProductDto): Promise<SuccessDto> {
        const productDetails = await this._ProductDetailsService.create(product.attributes);
        console.log(productDetails);
        // const shop: UserDocument = await this._UserService.findUserById(product.shop);
        //
        // if (!shop) {
        //     throw new ErrorDto('Shop is incorrect', HttpStatus.NOT_FOUND);
        // }
        //
        // const newProduct: ProductDocument = await this._ProductModel.create(plainToClass(Product, product));
        return new SuccessDto('Create product successfully', HttpStatus.CREATED, productDetails);
    }
}
