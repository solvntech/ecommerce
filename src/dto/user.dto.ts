import { Exclude, Expose } from 'class-transformer';
import { DefaultDataDto } from '@dto/core';
import { UserStatus } from '@constants';

@Exclude()
export class UserDto extends DefaultDataDto {
    @Expose()
    email: string;

    @Expose()
    status: UserStatus;

    @Expose()
    roles: string[];
}
