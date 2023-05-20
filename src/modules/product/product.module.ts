import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Product, ProductSchema } from '@schemas/product';
import { UserModule } from '@modules/user/user.module';
import { TokenModule } from '@modules/token/token.module';
import { ProductDetailsService } from '@modules/product/product-details.service';
import { PRODUCT_MODELS, ProductModelRegistry } from '@modules/product/product-model-registry';

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
        UserModule,
        TokenModule,
        MongooseModule.forFeature([
            {
                name: Product.name,
                schema: ProductSchema,
            },
        ]),
    ],
})
export class ProductModule {}
