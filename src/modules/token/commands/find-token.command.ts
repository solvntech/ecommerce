import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { TokenService } from '@modules/token/token.service';
import { TokenDocument } from '@schemas/token.schema';

export class FindTokenCommand implements ICommand {
    constructor(public readonly userId: string) {}
}

@CommandHandler(FindTokenCommand)
export class FindTokenHandler implements ICommandHandler<FindTokenCommand, TokenDocument> {
    constructor(private _TokenService: TokenService) {}

    execute(command: FindTokenCommand): Promise<TokenDocument> {
        return this._TokenService.findToken(command.userId);
    }
}
