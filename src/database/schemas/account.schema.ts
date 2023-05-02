import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EAccountStatus, AccountRoles } from '@constants';
import { HydratedDocument } from 'mongoose';

const COLLECTION_NAME = 'accounts';

export type AccountDocument = HydratedDocument<Account>;

@Schema({ collection: COLLECTION_NAME, timestamps: true })
export class Account {
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

    @Prop({ type: Array, default: [AccountRoles.SHOP] })
    roles: string[];
}

export const AccountSchema = SchemaFactory.createForClass(Account);
