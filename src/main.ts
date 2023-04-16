import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Configuration } from '@config/configuration';
import { LoggerServerService } from '@helpers/logger-server.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // load .env
    Configuration.init();

    // init logger
    LoggerServerService.init();
    await app.useLogger(LoggerServerService.instance);
    // apply http logger
    await app.use(LoggerServerService.morganMiddleware);

    return app.listen(Configuration.instance.port);
}
bootstrap().then(() => {
    LoggerServerService.log(`Server running at: http://localhost:${Configuration.instance.port}`);
});
