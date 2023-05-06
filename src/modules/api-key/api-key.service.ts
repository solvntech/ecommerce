import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { APIKey, APIKeyDocument } from '@schemas/api-key.schema';
import { Model } from 'mongoose';

@Injectable()
export class ApiKeyService {
    constructor(@InjectModel(APIKey.name) private _APIKeyModel: Model<APIKey>) {}

    async findAPIKey(key: string): Promise<APIKeyDocument> {
        return this._APIKeyModel.findOne({ key, status: true }).lean();
    }
}
