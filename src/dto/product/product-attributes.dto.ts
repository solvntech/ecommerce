import { Exclude, Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { ProductTypes } from '@constants';

@Exclude()
export class ProductAttributesDto {
    @Expose()
    @IsEnum(ProductTypes)
    type: ProductTypes;
}
