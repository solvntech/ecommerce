import { FilterQueryType } from '@types';
import { UserDocument } from '@schemas/user.schema';

export type FilterUserType = FilterQueryType<UserDocument>;
