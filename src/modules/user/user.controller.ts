import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from '@modules/user/user.service';
import { JwtGuard } from '@modules/token/guards/jwt.guard';

@Controller()
export class UserController {
    constructor(private _UserService: UserService) {}

    @UseGuards(JwtGuard)
    @Get('list')
    findAll() {
        return this._UserService.findAll();
    }
}
