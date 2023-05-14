import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Configuration } from '@config/configuration';
import { LoggerServerHelper } from '@helpers/logger-server.helper';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { rawBody: true });

    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });

    // init logger
    LoggerServerHelper.init();
    await app.useLogger(LoggerServerHelper.instance);

    // apply http logger
    await app.use(LoggerServerHelper.morganMiddleware);

    // validate input before jump into controller
    app.useGlobalPipes(new ValidationPipe());

    return app.listen(Configuration.instance.port);
}
bootstrap().then(() => {
    LoggerServerHelper.log(`Server running at: http://localhost:${Configuration.instance.port}`);
});
