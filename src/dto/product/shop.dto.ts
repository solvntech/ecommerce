import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ShopDto {
    @Expose()
    name: string;

    @Expose()
    email: string;
}
