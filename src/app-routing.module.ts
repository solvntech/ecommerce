import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { ShopModule } from '@modules/shop/shop.module';

const routes: Routes = [
    {
        path: 'v1/api',
        children: [{ path: 'shop', module: ShopModule }],
    },
];

@Module({
    imports: [ShopModule, RouterModule.register(routes)],
})
export class AppRoutingModule {}
