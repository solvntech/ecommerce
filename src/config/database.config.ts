import { Configuration, ENV_MODE } from '@config/configuration';
import * as mongoose from 'mongoose';
import { LoggerServerHelper } from '@helpers/logger-server.helper';

export class DatabaseConfig {
    private static _instance: typeof mongoose;
    static async init(): Promise<typeof mongoose> {
        if (!DatabaseConfig._instance) {
            if (Configuration.instance.env === ENV_MODE.DEV) {
                mongoose.set('debug', true);
                mongoose.set('debug', { color: true });
            }

            const mongoEnv = Configuration.instance.mongo;
            const urlConnection = `mongodb://${mongoEnv.host}:${mongoEnv.port}/${mongoEnv.databaseName}`;

            try {
                DatabaseConfig._instance = await mongoose.connect(urlConnection, {
                    maxPoolSize: 100,
                    authSource: 'admin',
                    user: mongoEnv.username,
                    pass: mongoEnv.password,
                });
                LoggerServerHelper.log('Connect mongoDB successfully');
            } catch (e) {
                LoggerServerHelper.error(`Connect mongoDB failed: ${e}`);
            }
        }
        return DatabaseConfig._instance;
    }

    static get instance() {
        return DatabaseConfig._instance;
    }
}
