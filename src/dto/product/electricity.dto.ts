import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

@Exclude()
export class ElectricityDto {
    @Expose()
    @IsNotEmpty()
    manufacturer: string;

    @Expose()
    @IsNotEmpty()
    model: string;

    @Expose()
    @IsNotEmpty()
    color: string;
}
