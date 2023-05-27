import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { UserDocument } from '@schemas/user.schema';
import { UserService } from '@modules/user/user.service';
import { AccountDto } from '@dto/account.dto';

export class CreateUserCommand implements ICommand {
    constructor(public readonly account: AccountDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand, UserDocument> {
    constructor(private _UserService: UserService) {}

    execute(command: CreateUserCommand): Promise<UserDocument> {
        return this._UserService.create(command.account);
    }
}
