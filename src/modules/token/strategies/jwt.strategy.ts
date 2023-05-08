import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as _ from 'lodash';
import { LoggerServerHelper } from '@helpers/logger-server.helper';
import { TokenService } from '@modules/token/token.service';
import { TokenDocument } from '@schemas/token.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private _TokenService: TokenService) {
        super(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKeyProvider: async (request, rawJwtToken, done) => {
                    const tokenArr = _.split(rawJwtToken, '.');
                    if (_.get(tokenArr, 1)) {
                        try {
                            const userId: string = JSON.parse(atob(_.get(tokenArr, 1)));
                            const token: TokenDocument = await this._TokenService.findToken(userId);
                            if (token) {
                                done(null, token.privateKey);
                            } else {
                                done('Invalid token');
                            }
                        } catch (e) {
                            LoggerServerHelper.error(e.toString());
                            done('Invalid token');
                        }
                    }
                    done('Invalid token');
                },
            },
            (payload, done) => {
                done(null, payload);
            },
        );
    }

    async validate(payload: any) {
        return payload;
    }
}
