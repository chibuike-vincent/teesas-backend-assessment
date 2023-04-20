import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { modules } from './customModule';

@Module({
  imports: [TypeOrmModule.forRoot(
    {
      type: "postgres",
      host: process.env.HOST,
      port: Number(process.env.DB_PORT),
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
export class AppModule {}
