import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@schemas/user.schema';
import { CreateUserHandler, FindUserByHandler } from '@modules/user/commands';

const handler = [CreateUserHandler, FindUserByHandler];

@Module({
    providers: [UserService, ...handler],
    controllers: [UserController],
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            },
        ]),
    ],
})
export class UserModule {}
