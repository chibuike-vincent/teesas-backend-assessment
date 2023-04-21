import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { modules } from './customModule';
@Module({
  imports: [TypeOrmModule.forRoot(
    {
      type: "postgres",
      host: "postgresql-122371-0.cloudclusters.net",
      port: 18821,
      username: "teesas",
      password: "password1@",
      database: "teesas",
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true
    }
  ),...modules],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
