import { Exclude, Expose } from 'class-transformer';
import { DefaultDataDto } from '@dto/core';
import { EAccountStatus } from '@constants';

@Exclude()
export class ShopAccountDto extends DefaultDataDto {
    @Expose()
    email: string;

    @Expose()
    status: EAccountStatus;

    @Expose()
    roles: string[];
}
