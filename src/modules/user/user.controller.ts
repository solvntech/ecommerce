import { Controller, Get } from '@nestjs/common';
import { UserService } from '@modules/user/user.service';

@Controller()
export class UserController {
    constructor(private _UserService: UserService) {}

    @Get('list')
    findAll() {
        return this._UserService.findAll();
    }
}
