import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

@Exclude()
export class LogoutDto {
    @Expose()
    @IsNotEmpty()
    refreshToken: string;
}
