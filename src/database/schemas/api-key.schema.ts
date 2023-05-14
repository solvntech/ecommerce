import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Permission } from '@constants';

const COLLECTION_NAME = 'api_keys';

export type APIKeyDocument = HydratedDocument<APIKey>;

@Schema({ collection: COLLECTION_NAME, timestamps: true })
export class APIKey {
    @Prop({ required: true, unique: true })
    key: string;

    @Prop({ type: Boolean, default: true })
    status: boolean;

    @Prop({ type: [String], required: true, enum: Permission })
    permissions: string[];
}

export const APIKeySchema = SchemaFactory.createForClass(APIKey);
