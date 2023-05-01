import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EAccountStatus, ShopRoles } from '@constants';
import { HydratedDocument } from 'mongoose';

const COLLECTION_NAME = 'shop_accounts';

export type ShopAccountDocument = HydratedDocument<ShopAccount>;

@Schema({ collection: COLLECTION_NAME, timestamps: true })
export class ShopAccount {
    @Prop({ maxlength: 150, trim: true })
    name: string;

    @Prop({ unique: true, isRequired: true, trim: true })
    email: string;

    @Prop({ isRequired: true, minlength: 8 })
    password: string;

    @Prop({ enum: EAccountStatus, default: EAccountStatus.IN_ACTIVE })
    status: EAccountStatus;

    @Prop({ type: Boolean, default: false })
    verify: boolean;

    @Prop({ type: Array, default: [ShopRoles.SHOP] })
    roles: string[];
}

export const ShopAccountSchema = SchemaFactory.createForClass(ShopAccount);
