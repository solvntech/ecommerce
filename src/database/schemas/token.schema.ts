import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '@schemas/user.schema';
import { TokenExpires } from '@constants';

const COLLECTION_NAME = 'tokens';

export type TokenDocument = HydratedDocument<Token>;

@Schema({ collection: COLLECTION_NAME, timestamps: true })
export class Token {
    @Prop({ type: mongoose.Schema.Types.ObjectId, isRequired: true, ref: User.name })
    user: User;

    @Prop({ isRequired: true })
    publicKey: string;

    @Prop({ isRequired: true })
    privateKey: string;

    @Prop({ type: Array, default: [] })
    refreshTokenUsed: string[];

    @Prop({ isRequired: true })
    refreshToken: string;

    @Prop({ default: TokenExpires.REFRESH_TOKEN })
    refreshTokenExpiresIn: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
