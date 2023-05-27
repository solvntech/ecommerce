import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { TokenService } from '@modules/token/token.service';
import { JwtPayload, PairSecretToken } from '@modules/token/types';

export class ProvideNewTokenCommand implements ICommand {
    constructor(public readonly payload: JwtPayload, public readonly oldRefreshToken: string) {}
}

@CommandHandler(ProvideNewTokenCommand)
export class ProvideNewTokenHandler implements ICommandHandler<ProvideNewTokenCommand, PairSecretToken> {
    constructor(private _TokenService: TokenService) {}

    execute(command: ProvideNewTokenCommand): Promise<PairSecretToken> {
        return this._TokenService.provideNewToken(command.payload, command.oldRefreshToken);
    }
}
