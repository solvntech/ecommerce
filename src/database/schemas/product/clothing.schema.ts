import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Clothing {
    @Prop({ required: true })
    branch: string;

    @Prop({ required: true })
    size: string;

    @Prop({ required: true })
    material: string;
}

export const ClothingSchema = SchemaFactory.createForClass(Clothing);
