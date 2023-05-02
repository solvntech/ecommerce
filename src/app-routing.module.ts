import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { AccountModule } from '@modules/account/account.module';

const routes: Routes = [
    {
        path: 'v1',
        children: [
            {
                path: 'auth',
                module: AccountModule,
            },
        ],
    },
];

@Module({
    imports: [AccountModule, RouterModule.register(routes)],
})
export class AppRoutingModule {}
