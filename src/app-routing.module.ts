import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { ShopAccountModule } from '@modules/shop-account/shop-account.module';

const routes: Routes = [
    {
        path: 'v1',
        children: [
            {
                path: 'auth',
                children: [{ path: 'shop', module: ShopAccountModule }],
            },
        ],
    },
];

@Module({
    imports: [ShopAccountModule, RouterModule.register(routes)],
})
export class AppRoutingModule {}
