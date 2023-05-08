import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@schemas/user.schema';
import { TokenModule } from '@modules/token/token.module';

@Module({
    providers: [UserService],
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
    exports: [UserService],
})
export class UserModule {}
