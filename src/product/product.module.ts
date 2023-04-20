import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { Product } from 'src/database/entities/product.entity';
import { UserService } from "src/user/user.service";
import { User } from "src/database/entities/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, ProductService, User]),
      ],
    controllers: [ProductController],
    providers: [ProductService]
})

export class ProductModules{}