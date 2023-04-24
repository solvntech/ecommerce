import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppRoutingModule } from './app-routing.module';
import { DatabaseModule } from '@database/database.module';
import { Configuration } from '@config/configuration';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true, load: [Configuration.init] }), AppRoutingModule, DatabaseModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
