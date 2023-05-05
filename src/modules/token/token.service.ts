import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from '@schemas/token.schema';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { JwtPayload, PairKey, PairToken } from '@types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
    constructor(@InjectModel(Token.name) private _TokenModel: Model<Token>, private _JwtService: JwtService) {}

    async generateToken(payload: JwtPayload): Promise<PairToken> {
        // create rsa pair key
        const { privateKey, publicKey } = this.createSecretPairKey();

        // create pair jwt token
        const accessToken: string = this.createJwtToken(payload, privateKey, '1h');
        const refreshToken: string = this.createJwtToken(payload, privateKey, '7d');

        await this.saveToken(payload.id, publicKey, refreshToken);

        return { refreshToken, accessToken };
    }

    private async saveToken(userId: string, publicKey: string, refreshToken: string): Promise<TokenDocument> {
        return this._TokenModel.create({ user: userId, publicKey: publicKey, refreshToken: [refreshToken] });
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
            modulusLength: 4096,
            privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
            publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
        });
        return { privateKey, publicKey };
    }
}
