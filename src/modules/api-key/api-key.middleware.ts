import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { HEADER_KEY, HEADER_KEY_INTERNAL } from '@constants';
import { ApiKeyService } from '@modules/api-key/api-key.service';
import { APIKeyDocument } from '@schemas/api-key.schema';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
    constructor(private _ApiKeyService: ApiKeyService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const key: string = req.get(HEADER_KEY.API_KEY);

        if (!key) {
            throw new ForbiddenException();
        }

        const apiKey: APIKeyDocument = await this._ApiKeyService.findAPIKey(key);

        if (!apiKey) {
            throw new ForbiddenException();
        }

        req[HEADER_KEY_INTERNAL.API_OBJECT_KEY] = apiKey;

        next();
    }
}
