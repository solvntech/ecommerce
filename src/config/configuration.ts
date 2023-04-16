import { TConfig } from '@types';

export enum ENV_MODE {
    DEV = 'DEV',
    PRO = 'PRO',
}

export class Configuration {
    private static _config: TConfig;

    static init(): TConfig {
        if (!Configuration._config) {
            const envMode: string = process.env.NODE_ENV || ENV_MODE.DEV;
            Configuration._config = {
                env: envMode,
                port: parseInt(process.env[`${envMode}_API_PORT`], 10),
                mongo: {
                    host: process.env[`${envMode}_MONGO_HOST`],
                    port: parseInt(process.env[`${envMode}_MONGO_PORT`], 10),
                    username: process.env[`${envMode}_MONGO_USERNAME`],
                    password: process.env[`${envMode}_MONGO_PASSWORD`],
                    databaseName: process.env[`${envMode}_MONGO_BD_NAME`],
                },
            };
        }
        return Configuration._config;
    }

    static get instance(): TConfig {
        return Configuration._config;
    }
}
