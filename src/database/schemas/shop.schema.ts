import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'shops', timestamps: true })
export class Shop {
    @Prop({ maxlength: 150, trim: true })
    name: string;

    @Prop({ unique: true, isRequired: true, trim: true })
    email: string;

    @Prop({ isRequired: true, minlength: 8 })
    password: string;

    @Prop({ enum: ['active', 'inActive'], default: 'inActive' })
    status: string;

    @Prop({ type: Boolean, default: false })
    verify: boolean;

    @Prop({ type: Array, default: [] })
    roles: string[];
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
