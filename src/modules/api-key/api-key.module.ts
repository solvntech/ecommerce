import { Module } from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { MongooseModule } from '@nestjs/mongoose';
import { APIKey, APIKeySchema } from '@schemas/api-key.schema';

@Module({
    providers: [ApiKeyService],
    imports: [
        MongooseModule.forFeature([
            {
                name: APIKey.name,
                schema: APIKeySchema,
            },
        ]),
    ],
})
export class ApiKeyModule {}
