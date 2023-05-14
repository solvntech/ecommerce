import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProductTypes } from '@constants';

@Schema({ _id: false, discriminatorKey: 'type', autoCreate: false })
export class ProductAttributes {
    @Prop({ required: true, enum: ProductTypes })
    type: ProductTypes;
}

export const ProductAttributesSchema = SchemaFactory.createForClass(ProductAttributes);
