import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '@schemas/user.schema';

const COLLECTION_NAME = 'tokens';

export type TokenDocument = HydratedDocument<Token>;

@Schema({ collection: COLLECTION_NAME, timestamps: true })
export class Token {
    @Prop({ type: mongoose.Schema.Types.ObjectId, isRequired: true, ref: 'tokens' })
    user: User;

    @Prop({ isRequired: true })
    publicKey: string;

    @Prop({ type: Array, default: [] })
    refreshToken: string[];
}

export const TokenSchema = SchemaFactory.createForClass(Token);
