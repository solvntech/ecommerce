import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserStatus, UserRoles } from '@constants';
import { HydratedDocument } from 'mongoose';

const COLLECTION_NAME = 'users';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: COLLECTION_NAME, timestamps: true })
export class User {
    @Prop({ maxlength: 150, trim: true })
    name: string;

    @Prop({ unique: true, isRequired: true, trim: true })
    email: string;

    @Prop({ isRequired: true, minlength: 8 })
    password: string;

    @Prop({ enum: UserStatus, default: UserStatus.IN_ACTIVE })
    status: UserStatus;

    @Prop({ type: Boolean, default: false })
    verify: boolean;

    @Prop({ type: Array, default: [UserRoles.SHOP] })
    roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
