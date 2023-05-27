import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { UserDocument } from '@schemas/user.schema';
import { UserService } from '@modules/user/user.service';
import { FilterUserType } from '@modules/user/types';
import mongoose from 'mongoose';

export class FindUserByCommand implements ICommand {
    constructor(public readonly query: FilterUserType) {}
}

@CommandHandler(FindUserByCommand)
export class FindUserByHandler implements ICommandHandler<FindUserByCommand, UserDocument> {
    constructor(private _UserService: UserService) {}

    execute(command: FindUserByCommand): Promise<UserDocument> {
        const query = command.query;
        if (query.id) {
            query.id = new mongoose.Types.ObjectId(query.id);
        }
        return this._UserService.findUserBy(query);
    }
}
