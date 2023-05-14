import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '@schemas/product';
import { UserModule } from '@modules/user/user.module';

@Module({
    providers: [ProductService],
    controllers: [ProductController],
    imports: [
        UserModule,
        MongooseModule.forFeature([
            {
                name: Product.name,
                schema: ProductSchema,
            },
        ]),
    ],
})
export class ProductModule {}
