import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from '@modules/user/user.module';
import { ProductModule } from '@modules/product/product.module';

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
            {
                path: 'product',
                module: ProductModule,
            },
        ],
    },
];

@Module({
    imports: [AuthModule, UserModule, ProductModule, RouterModule.register(routes)],
})
export class AppRoutingModule {}
