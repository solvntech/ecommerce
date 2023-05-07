export type TConfig = {
    env: string;
    port: number;
    mongo: {
        port: number;
        host: string;
        username: string;
        password: string;
        databaseName: string;
    };
    smtpHost: string;
    smtpAuth: {
        user: string;
        pass: string;
    };
};
