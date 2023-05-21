import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { User } from '@schemas/user.schema';
import { ProductAttributes, ProductAttributesSchema } from '@schemas/product';
import * as _ from 'lodash';
import { UtilHelper } from '@helpers/util.helper';
import { ProductTypes } from '@constants';

const COLLECTION_NAME = 'products';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ collection: COLLECTION_NAME, timestamps: true })
export class Product {
    @Prop({ required: true, name: 'product_name' })
    name: string;

    @Prop({ name: 'product_thumbnail' })
    thumbnail: string;

    @Prop({ name: 'product_description' })
    description: string;

    @Prop({ name: 'product_slug' })
    slug: string;

    @Prop({
        name: 'product_ratings_average',
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be less than 5.0'],
        set: (val) => _.round(val, 2),
    })
    ratingsAverage: number;

    @Prop({ required: true, name: 'product_price' })
    price: number;

    @Prop({ required: true, name: 'product_quantity' })
    quantity: number;

    @Prop({ type: Boolean, name: 'product_is_draft', default: true })
    isDraft: boolean;

    @Prop({ required: true, enum: ProductTypes })
    type: ProductTypes;

    @Prop({ type: Boolean, name: 'product_is_published', default: false })
    isPublished: boolean;

    @Prop({ type: MongooseSchema.Types.ObjectId, name: 'shop_owner', required: true, ref: User.name })
    shop: User;

    @Prop({ type: [ProductAttributesSchema], required: true, name: 'product_attributes' })
    attributes: ProductAttributes[];
}

const schema = SchemaFactory.createForClass(Product);

schema.pre('save', function (next) {
    this.slug = UtilHelper.slugify(this.name);
    this.thumbnail = `https://${this.slug}.png`;
    next();
});

export const ProductSchema = schema;
