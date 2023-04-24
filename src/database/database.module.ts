import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MongoDatabase } from '@database/mongo.database';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useClass: MongoDatabase,
        }),
    ],
})
export class DatabaseModule {}
