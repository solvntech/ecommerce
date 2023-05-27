import { HttpStatus, Injectable } from '@nestjs/common';
import { AccountDto } from '@dto/account.dto';
import { BcryptHelper } from '@helpers/bcrypt.helper';
import { UserDocument } from '@schemas/user.schema';
import { ErrorDto, SuccessDto } from '@dto/core';
import { MailerService } from '@modules/mailer/mailer.service';
import { TokenDocument } from '@schemas/token.schema';
import * as _ from 'lodash';
import { LoggerServerHelper } from '@helpers/logger-server.helper';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand, FindUserByCommand } from '@modules/user/commands';
import { JwtPayload, PairSecretToken, PairSecretTokenType, RemoveTokenByType } from '@modules/token/types';
import {
    FindTokenCommand,
    GenerateTokenCommand,
    ProvideNewTokenCommand,
    RemoveTokenCommand,
    VerifyTokenCommand,
} from '@modules/token/commands';
import { ExtractTokenCommand } from '@modules/token/commands/extract-token.command';

@Injectable()
export class AuthService {
    constructor(private _CommandBus: CommandBus, private _MailerService: MailerService) {}

    async createAccount(account: AccountDto): Promise<SuccessDto> {
        const existAccount: UserDocument = await this.findUserByEmail(account.email);

        if (existAccount) {
            throw new ErrorDto('Duplicate account', HttpStatus.CONFLICT);
        }
        account.password = await BcryptHelper.hashPassword(account.password);
        const user: UserDocument = await this._CommandBus.execute(new CreateUserCommand(account));

        const payload: JwtPayload = {
            id: user._id.toString(),
            role: user.roles,
            email: user.email,
        };

        // create jwt token
        const tokenObj: PairSecretToken = await this.generateToken(payload);

        if (tokenObj) {
            return new SuccessDto('Create account successfully', HttpStatus.CREATED, {
                ...payload,
                ...tokenObj,
            });
        }
        throw new ErrorDto('Create account successfully but create token failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    async validateUser(email: string, password: string): Promise<SuccessDto> {
        const currentAccount: UserDocument = await this.findUserByEmail(email);
        if (currentAccount) {
            if (await BcryptHelper.validatePassword(password, currentAccount.password)) {
                const payload: JwtPayload = {
                    id: currentAccount._id.toString(),
                    role: currentAccount.roles,
                    email: currentAccount.email,
                };

                // create jwt token
                const tokenObj: PairSecretToken = await this.generateToken(payload);

                if (tokenObj) {
                    return new SuccessDto('Login successfully', HttpStatus.OK, {
                        ...payload,
                        ...tokenObj,
                    });
                }
                throw new ErrorDto('Account is logged', HttpStatus.CONFLICT);
            }
        }
        throw new ErrorDto('Email or password is incorrect', HttpStatus.BAD_REQUEST);
    }

    private async findUserByEmail(email: string): Promise<UserDocument> {
        return this._CommandBus.execute(new FindUserByCommand({ email }));
    }

    async logout(refreshToken: string): Promise<SuccessDto> {
        const isSuccess: boolean = await this.removeToken('refreshToken', refreshToken);
        if (isSuccess) {
            return new SuccessDto('Logout successfully');
        }
        throw new ErrorDto('Invalid Token', HttpStatus.BAD_REQUEST);
    }

    async handleRefreshToken(refreshToken: string): Promise<SuccessDto> {
        const userPayload: JwtPayload = await this.extractToken(refreshToken);

        if (!userPayload) {
            throw new ErrorDto('Invalid Token', HttpStatus.BAD_REQUEST);
        }

        const token: TokenDocument = await this.findToken(userPayload.id);

        if (!token) {
            throw new ErrorDto('Invalid Token', HttpStatus.BAD_REQUEST);
        }

        if (_.includes(token.refreshTokenUsed, refreshToken)) {
            // remove token
            await this.removeToken('user', userPayload.id);
            throw new ErrorDto('Account was stolen', HttpStatus.FORBIDDEN);
        }

        if (token.refreshToken !== refreshToken) {
            throw new ErrorDto('Invalid Token', HttpStatus.BAD_REQUEST);
        }

        try {
            await this.verifyToken(refreshToken, token.publicKey);
            const tokenObj: PairSecretToken = await this.provideNewToken(
                {
                    id: userPayload.id,
                    email: userPayload.email,
                    role: userPayload.role,
                },
                refreshToken,
            );
            return new SuccessDto(null, HttpStatus.CREATED, tokenObj);
        } catch (e) {
            LoggerServerHelper.error(e.toString());
            // remove token
            await this.removeToken('user', userPayload.id);
            throw new ErrorDto('Token is expired', HttpStatus.FORBIDDEN);
        }
    }

    private async generateToken(payload: JwtPayload): Promise<PairSecretTokenType> {
        return this._CommandBus.execute(new GenerateTokenCommand(payload));
    }

    private async removeToken(by: RemoveTokenByType, value: string): Promise<boolean> {
        return this._CommandBus.execute(new RemoveTokenCommand(by, value));
    }

    private async findToken(userId: string): Promise<TokenDocument> {
        return this._CommandBus.execute(new FindTokenCommand(userId));
    }

    private async provideNewToken(payload: JwtPayload, oldRefreshToken: string): Promise<PairSecretToken> {
        return this._CommandBus.execute(new ProvideNewTokenCommand(payload, oldRefreshToken));
    }

    private async extractToken(token: string): Promise<JwtPayload> {
        return this._CommandBus.execute(new ExtractTokenCommand(token));
    }

    private async verifyToken(token: string, secretKey: string): Promise<JwtPayload> {
        return this._CommandBus.execute(new VerifyTokenCommand(token, secretKey));
    }
}
