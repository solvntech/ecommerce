export type TConfig = {
    env: string;
    secret: string;
    port: number;
    mongo: {
        port: number;
        host: string;
        username: string;
        password: string;
        databaseName: string;
    };
};
