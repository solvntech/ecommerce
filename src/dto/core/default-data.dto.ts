import { Expose, Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class DefaultDataDto {
    // get object id and transform to string
    @Transform((value) => value.obj._id.toString())
    @Expose({ name: '_id' })
    id: Types.ObjectId;

    @Expose()
    createdAt: string;

    @Expose()
    updatedAt: string;
}
