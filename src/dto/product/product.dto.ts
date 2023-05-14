import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { ProductTypes } from '@constants';
import { ProductAttributesDto, ElectricityDto, ClothingDto } from '@dto/product';

@Exclude()
export class ProductDto {
    @Expose()
    @IsNotEmpty()
    name: string;

    @Expose()
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @Expose()
    @IsNumber()
    quantity: number;

    @Expose()
    @IsNotEmpty()
    thumbnail: string;

    @Expose()
    description: string;

    @Expose()
    @IsNotEmpty()
    shop: string;

    @Expose()
    @ValidateNested({ each: true })
    @Type(() => ProductAttributesDto, {
        keepDiscriminatorProperty: true,
        discriminator: {
            property: 'type',
            subTypes: [
                { value: ElectricityDto, name: ProductTypes.ELECTRONIC },
                { value: ClothingDto, name: ProductTypes.CLOTHING },
            ],
        },
    })
    attributes;
}
