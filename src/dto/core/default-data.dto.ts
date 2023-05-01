import { Expose } from 'class-transformer';
import { Types } from 'mongoose';

export class DefaultDataDto {
    @Expose()
    createdAt: string;

    @Expose()
    updatedAt: string;

    @Expose()
    _id: Types.ObjectId;
}
