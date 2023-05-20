import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

const COLLECTION_NAME = 'clothes';

@Schema({ collection: COLLECTION_NAME })
export class Clothing {
    @Prop({ required: true })
    branch: string;

    @Prop({ required: true })
    size: string;

    @Prop({ required: true })
    material: string;
}

export const ClothingSchema = SchemaFactory.createForClass(Clothing);
