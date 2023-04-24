import { HttpException } from '@nestjs/common';

export class ErrorDto extends HttpException {
    get error() {
        return {
            statusCode: this.getStatus(),
            message: this.getResponse(),
        };
    }
}
