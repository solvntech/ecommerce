import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from '@schemas/token.schema';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@modules/token/strategies/jwt.strategy';

@Module({
    providers: [TokenService, JwtStrategy],
    imports: [
        MongooseModule.forFeature([
            {
                name: Token.name,
                schema: TokenSchema,
            },
        ]),
        JwtModule.register({}),
    ],
    exports: [TokenService],
})
export class TokenModule {}
