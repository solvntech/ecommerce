import * as mongoose from 'mongoose';
import { LoggerServerHelper } from '@helpers/logger-server.helper';

export class MongoHelper {
    static checkConnection(): void {
        const numConnection: number = mongoose.connections.length;
        LoggerServerHelper.log(`Number of mongodb connection: ${numConnection}`);
    }
}
