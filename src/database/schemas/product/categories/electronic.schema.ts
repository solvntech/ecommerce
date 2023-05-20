import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

const COLLECTION_NAME = 'electronics';

@Schema({ collection: COLLECTION_NAME })
export class Electronic {
    @Prop({ required: true })
    manufacturer: string;

    @Prop({ required: true })
    model: string;

    @Prop({ required: true })
    color: string;
}

export const ElectronicSchema = SchemaFactory.createForClass(Electronic);
