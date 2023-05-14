import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from '@schemas/product';
import { Model } from 'mongoose';
import { ProductDto } from '@dto/product';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ProductService {
    constructor(@InjectModel(Product.name) private _ProductModel: Model<Product>) {}

    async findAllProduct(): Promise<ProductDocument[]> {
        return this._ProductModel.find().lean();
    }

    async createProduct(product: ProductDto): Promise<ProductDocument> {
        return this._ProductModel.create(plainToClass(Product, product));
    }
}
