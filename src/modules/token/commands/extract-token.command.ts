import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { TokenService } from '@modules/token/token.service';
import { JwtPayload } from '@modules/token/types';

export class ExtractTokenCommand implements ICommand {
    constructor(public readonly token: string) {}
}

@CommandHandler(ExtractTokenCommand)
export class ExtractTokenHandler implements ICommandHandler<ExtractTokenCommand, JwtPayload> {
    constructor(private _TokenService: TokenService) {}

    async execute(command: ExtractTokenCommand): Promise<JwtPayload> {
        return this._TokenService.extractToken(command.token);
    }
}
