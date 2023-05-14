import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '@schemas/user.schema';

const COLLECTION_NAME = 'tokens';

export type TokenDocument = HydratedDocument<Token>;

@Schema({ collection: COLLECTION_NAME, timestamps: true })
export class Token {
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: User.name })
    user: User;

    @Prop({ required: true })
    publicKey: string;

    @Prop({ required: true })
    privateKey: string;

    @Prop({ type: Array, default: [] })
    refreshTokenUsed: string[];

    @Prop({ required: true })
    refreshToken: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
