import { Clothing, ClothingSchema } from '@schemas/product/clothing.schema';
import { Electronic, ElectronicSchema } from '@schemas/product/electronic.schema';
import * as mongoose from 'mongoose';

export const RegistrySchema: Partial<mongoose.Schema> = {
    [Clothing.name]: ClothingSchema,
    [Electronic.name]: ElectronicSchema,
};
