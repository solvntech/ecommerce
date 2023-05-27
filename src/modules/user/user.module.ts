import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@schemas/user.schema';
import { TokenModule } from '@modules/token/token.module';
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
        TokenModule,
    ],
})
export class UserModule {}
