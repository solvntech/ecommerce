import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from '@schemas/token.schema';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@modules/token/strategies/jwt.strategy';
import {
    ExtractTokenHandler,
    FindTokenHandler,
    GenerateTokenHandler,
    ProvideNewTokenHandler,
    RemoveTokenHandler,
    VerifyTokenHandler,
} from '@modules/token/commands';

const handlers = [
    GenerateTokenHandler,
    RemoveTokenHandler,
    ExtractTokenHandler,
    FindTokenHandler,
    ProvideNewTokenHandler,
    VerifyTokenHandler,
];

@Module({
    providers: [...handlers, TokenService, JwtStrategy],
    imports: [
        MongooseModule.forFeature([
            {
                name: Token.name,
                schema: TokenSchema,
            },
        ]),
        JwtModule.register({}),
    ],
})
export class TokenModule {}
