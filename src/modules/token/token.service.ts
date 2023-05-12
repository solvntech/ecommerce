import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from '@schemas/token.schema';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { JwtPayload, PairKey, PairSecretToken, TToken } from '@types';
import { JwtService } from '@nestjs/jwt';
import { TokenExpires } from '@constants';
import * as mongoose from 'mongoose';

@Injectable()
export class TokenService {
    constructor(@InjectModel(Token.name) private _TokenModel: Model<Token>, private _JwtService: JwtService) {}

    async generateToken(payload: JwtPayload): Promise<PairSecretToken | null> {
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
        const tokenData: TokenDocument = await this._TokenModel
            .findOne({ user: new mongoose.Types.ObjectId(userId) })
            .lean()
            .lean();
        return tokenData?.refreshToken ? tokenData : null;
    }

    async removeToken(refreshToken: string): Promise<boolean> {
        const tokenData: TokenDocument = await this._TokenModel.findOneAndRemove({ refreshToken }).lean();

        return !!tokenData;
    }

    extractToken(token: string): JwtPayload {
        return this._JwtService.decode(token) as JwtPayload;
    }
}
