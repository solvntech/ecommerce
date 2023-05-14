import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { User } from '@schemas/user.schema';
import {
    ProductAttributes,
    ProductAttributesSchema,
    Clothing,
    ClothingSchema,
    Electronic,
    ElectronicSchema,
} from '@schemas/product';

const COLLECTION_NAME = 'products';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ collection: COLLECTION_NAME, timestamps: true })
export class Product {
    @Prop({ required: true, name: 'product_name' })
    name: string;

    @Prop({ required: true, name: 'product_thumbnail' })
    thumbnail: string;

    @Prop({ name: 'product_description' })
    description: string;

    @Prop({ required: true, name: 'product_price' })
    price: number;

    @Prop({ required: true, name: 'product_quantity' })
    quantity: number;

    @Prop({ type: MongooseSchema.Types.ObjectId, name: 'shop_owner', required: true, ref: User.name })
    shop: User;

    @Prop({
        type: ProductAttributesSchema,
        required: true,
        name: 'product_attributes',
        discriminators: {
            [Clothing.name]: ClothingSchema,
            [Electronic.name]: ElectronicSchema,
        },
    })
    attributes: ProductAttributes;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
