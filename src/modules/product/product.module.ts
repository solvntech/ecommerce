import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Product, ProductSchema } from '@schemas/product';
import { ProductDetailsService } from '@modules/product/product-details.service';
import { PRODUCT_MODELS, ProductModelRegistry } from '@modules/product/product-model-registry';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
    providers: [
        ProductService,
        ProductDetailsService,
        {
            provide: PRODUCT_MODELS,
            useFactory: ProductModelRegistry,
            inject: [getConnectionToken()],
        },
    ],
    controllers: [ProductController],
    imports: [
        CqrsModule,
        MongooseModule.forFeature([
            {
                name: Product.name,
                schema: ProductSchema,
            },
        ]),
    ],
})
export class ProductModule {}
