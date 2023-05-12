import { HttpException } from '@nestjs/common';

export type TError = {
    statusCode: number;
    message: string | object;
    data?: any;
};

export class ErrorDto extends HttpException {
    get error(): TError {
        return {
            statusCode: this.getStatus(),
            message: this.getResponse(),
        };
    }
}
