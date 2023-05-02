import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from '@modules/user/user.module';

const routes: Routes = [
    {
        path: 'v1',
        children: [
            {
                path: 'auth',
                module: AuthModule,
            },
            {
                path: 'user',
                module: UserModule,
            },
        ],
    },
];

@Module({
    imports: [AuthModule, UserModule, RouterModule.register(routes)],
})
export class AppRoutingModule {}
