import { HttpStatus } from '@nestjs/common';

export class SuccessDto {
    message: string;
    statusCode: HttpStatus;
    data?: any;

    constructor(message: string, status: HttpStatus = HttpStatus.OK, data: any = null) {
        this.statusCode = status;
        this.message = message;
        if (data) {
            this.data = data;
        }
    }
}
