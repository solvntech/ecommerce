import { Exclude, Expose } from 'class-transformer';
import { IsArray, IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

@Exclude()
export class AccountDto {
    @Expose()
    name: string;

    @Expose()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Expose()
    @IsStrongPassword({ minLength: 8 })
    password: string;

    @Expose()
    @IsArray()
    roles: string[];
}
