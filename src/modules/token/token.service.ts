import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from '@schemas/token.schema';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { JwtPayload, PairKey, PairSecretToken, TToken } from '@types';
import { JwtService } from '@nestjs/jwt';
import { TokenExpires } from '@constants';

@Injectable()
export class TokenService {
    constructor(@InjectModel(Token.name) private _TokenModel: Model<Token>, private _JwtService: JwtService) {}

    async generateToken(payload: JwtPayload): Promise<PairSecretToken> {
        // find secret pair key
        const token: TokenDocument = await this._TokenModel.findOne({ user: payload.id }).lean();

        let privateKey: string;
        let publicKey: string;

        if (token) {
            privateKey = token.privateKey;
            publicKey = token.publicKey;
        } else {
            // create rsa pair key
            const pairSecretKey: PairKey = this.createSecretPairKey();
            privateKey = pairSecretKey.privateKey;
            publicKey = pairSecretKey.publicKey;
        }

        // create pair jwt token
        const accessToken: string = this.createJwtToken(payload, privateKey, TokenExpires.ACCESS_TOKEN);
        const refreshToken: string = this.createJwtToken(payload, privateKey, TokenExpires.REFRESH_TOKEN);

        if (!token) {
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
        return this._TokenModel.create(token);
    }

    private createJwtToken(payload: JwtPayload, privateKey: string, expiresIn: string) {
        return this._JwtService.sign(payload, {
            algorithm: 'RS256',
            expiresIn,
            privateKey,
        });
    }

    private createSecretPairKey(): PairKey {
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
            publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
        });
        return { privateKey, publicKey };
    }

    async verifyToken(userId: string, token: string): Promise<JwtPayload> {
        const tokenData: TokenDocument = await this._TokenModel.findOne({ user: userId }).lean();
        return this._JwtService.verify(token, {
            publicKey: tokenData.publicKey,
        });
    }
}
