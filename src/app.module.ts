import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { modules } from './customModule';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes the environment variables available globally
    }),
    TypeOrmModule.forRoot(
    {
      type: "postgres",
      host: process.env.HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true
    }
  ),...modules],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    dotenv.config(); // loads the environment variables from .env file
  }
}
