import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Configuration } from '@config/configuration';
import { LoggerServerHelper } from '@helpers/logger-server.helper';
import { DatabaseConfig } from '@config/database.config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // load .env
    Configuration.init();

    // init logger
    LoggerServerHelper.init();
    await app.useLogger(LoggerServerHelper.instance);
    // apply http logger
    await app.use(LoggerServerHelper.morganMiddleware);

    // connect mongoose
    await DatabaseConfig.init();

    return app.listen(Configuration.instance.port);
}
bootstrap().then(() => {
    LoggerServerHelper.log(`Server running at: http://localhost:${Configuration.instance.port}`);
});
