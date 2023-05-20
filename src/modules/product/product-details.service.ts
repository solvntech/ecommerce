import { Inject, Injectable } from '@nestjs/common';
import { ProductAttributesDto } from '@dto/product';
import { PRODUCT_MODELS } from '@modules/product/product-model-registry';
import { Model } from 'mongoose';

@Injectable()
export class ProductDetailsService {
    constructor(@Inject(PRODUCT_MODELS) private _ProductModels: Record<string, Model<any>>) {}

    async create(productDetail: ProductAttributesDto) {
        const model = this._ProductModels[productDetail.type];
        return model.create(productDetail);
    }
}
