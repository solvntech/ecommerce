import { Exclude, Expose, Type } from 'class-transformer';
import { ShopDto } from '@dto/product';
import { DefaultDataDto } from '@dto/core';

@Exclude()
export class ProductResDto extends DefaultDataDto {
    @Expose()
    name: string;

    @Expose()
    price: number;

    @Expose()
    quantity: number;

    @Expose()
    thumbnail: string;

    @Expose()
    description: string;

    @Expose()
    @Type(() => ShopDto)
    shop: ShopDto;

    @Expose()
    attributes;
}
