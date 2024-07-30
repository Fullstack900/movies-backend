import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { loadConfig } from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';
import { UserModule } from './modules/users/users.module';
import { MovieModule } from './modules/movie/movie.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [ormConfig, ...loadConfig], expandVariables: true, }),
    TypeOrmModule.forRootAsync({ useFactory: process.env.NODE_ENV !== "production" ? ormConfig : ormConfigProd }),
    UserModule,
    MovieModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
