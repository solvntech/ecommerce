import { ModelDefinition } from '@nestjs/mongoose';
import { Clothing, ClothingSchema, Electronic, ElectronicSchema } from '@schemas/product';

export const SchemaRegistry: ModelDefinition[] = [
    { name: Clothing.name, schema: ClothingSchema },
    { name: Electronic.name, schema: ElectronicSchema },
];
