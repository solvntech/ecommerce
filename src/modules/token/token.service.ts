import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from '@schemas/token.schema';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { TokenExpires } from '@constants';
import * as mongoose from 'mongoose';
import {
    JwtPayload,
    PairKey,
    PairSecretToken,
    PairSecretTokenType,
    RemoveTokenByType,
    TToken,
} from '@modules/token/types';

@Injectable()
export class TokenService {
    constructor(@InjectModel(Token.name) private _TokenModel: Model<Token>, private _JwtService: JwtService) {}

    async generateToken(payload: JwtPayload): Promise<PairSecretTokenType> {
        // find secret pair key
        const token: TokenDocument = await this._TokenModel.findOne({ user: payload.id }).lean();

        if (token) {
            return null;
        }

        // create pair key
        const { privateKey, publicKey }: PairKey = this.createSecretPairKey();

        // create pair jwt token
        const accessToken: string = this.createJwtToken(payload, privateKey, TokenExpires.ACCESS_TOKEN);
        const refreshToken: string = this.createJwtToken(payload, publicKey, TokenExpires.REFRESH_TOKEN);

        // update refresh token
        if (!token || !token.refreshToken) {
            await this.saveToken({
                user: payload.id,
                privateKey,
                publicKey,
                refreshToken: refreshToken,
            });
        }

        return { refreshToken, accessToken };
    }

    private async saveToken(token: TToken): Promise<TokenDocument> {
        const { user, ...obj } = token;
        return this._TokenModel.findOneAndUpdate({ user }, obj, { upsert: true, new: true }).lean();
    }

    private createJwtToken(payload: JwtPayload, secretKey: string, expiresIn: string) {
        return this._JwtService.sign(payload, {
            // algorithm: 'RS256',
            expiresIn,
            privateKey: secretKey,
        });
    }

    private createSecretPairKey(): PairKey {
        return {
            privateKey: crypto.randomBytes(64).toString('hex'),
            publicKey: crypto.randomBytes(64).toString('hex'),
        };
    }

    async findToken(userId: string): Promise<TokenDocument> {
        return this._TokenModel
            .findOne({ user: new mongoose.Types.ObjectId(userId) })
            .lean()
            .lean();
    }

    async removeToken(by: RemoveTokenByType, value: string): Promise<boolean> {
        const tokenData: TokenDocument = await this._TokenModel.findOneAndRemove({ [by]: value }).lean();

        return !!tokenData;
    }

    extractToken(token: string): JwtPayload {
        return this._JwtService.decode(token) as JwtPayload;
    }

    async provideNewToken(payload: JwtPayload, oldRefreshToken: string): Promise<PairSecretToken> {
        // create new pair key
        const { privateKey, publicKey }: PairKey = this.createSecretPairKey();

        // create new pair jwt token
        const accessToken: string = this.createJwtToken(payload, privateKey, TokenExpires.ACCESS_TOKEN);
        const refreshToken: string = this.createJwtToken(payload, publicKey, TokenExpires.REFRESH_TOKEN);

        // update token
        await this._TokenModel.updateOne(
            { user: payload.id },
            {
                $set: { refreshToken, privateKey, publicKey },
                $push: { refreshTokenUsed: oldRefreshToken },
            },
        );

        return { refreshToken, accessToken };
    }

    async verifyToken(token: string, secretKey: string): Promise<JwtPayload> {
        return this._JwtService.verify(token, {
            secret: secretKey,
        });
    }
}
