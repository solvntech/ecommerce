import { Injectable, Scope } from '@nestjs/common';
import * as winston from 'winston';
import * as path from 'path';
import * as morgan from 'morgan';
import { Handler } from 'express';
import { Configuration } from '@config/configuration';

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'cyan',
    verbose: 'blue',
    debug: 'magenta',
    silly: 'white',
};

const colorizes = winston.format.colorize({
    all: true,
});

// log format string
const someColoredFormat = winston.format.printf(({ level, timestamp, message, method }) => {
    const envMode: string = Configuration.instance.env;
    return `[${envMode}] ${timestamp} ${level}: ${method ? colorizes.colorize(level, method) : ''} ${message}`;
});

const format = winston.format.combine(
    winston.format.cli({
        colors,
        levels,
    }),
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.simple(),
    someColoredFormat
);

@Injectable({
    scope: Scope.DEFAULT,
})
export class LoggerServerService {
    private static logger: winston.Logger;
    private static morgan: Handler;

    static init() {
        // init morgan
        if (!LoggerServerService.morgan) {
            LoggerServerService.morgan = morgan(':method :url :status :res[content-length] - :response-time ms', {
                stream: {
                    write: (message) => LoggerServerService.logger.http(message.trim()),
                },
            });
        }

        // init winston logger
        if (!LoggerServerService.logger) {
            LoggerServerService.logger = winston.createLogger({
                level: 'http',
                transports: [
                    new winston.transports.Console({
                        format,
                    }),
                    new winston.transports.File({
                        maxsize: 1024 * 1024 * 10,
                        filename: path.join('logs', 'server.log'),
                        format,
                    }),
                ],
                exceptionHandlers: [new winston.transports.File({ filename: path.join('logs', 'error.log') })],
            });
        }
    }

    static log(msg: any) {
        LoggerServerService.logger.info(msg);
    }

    static error(msg: any) {
        LoggerServerService.logger?.error(msg);
    }

    static warn(msg: any) {
        LoggerServerService.logger.warn(msg);
    }

    static get instance() {
        return LoggerServerService.logger;
    }

    static get morganMiddleware() {
        return LoggerServerService.morgan;
    }
}
