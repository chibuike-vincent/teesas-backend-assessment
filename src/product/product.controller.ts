import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Put, Req, Request, UseGuards } from "@nestjs/common";
import { ProductService } from './product.service';
import {CreateProductDto,ProductResponseDto, BuyProductDto} from "./dto/dto"
import { AuthGuard } from '../auth/auth.guard';


@Controller('api/v1/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}


  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
    async getProducts():Promise<ProductResponseDto[]>{
        return await this.productService.getProducts()
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post()
    createProduct(@Body() requestBody:CreateProductDto, @Request() req){
        return this.productService.createProduct(requestBody, req)
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get("/:id")
    getProductById(@Param("id", ParseIntPipe) id:number){
        return this.productService.getProductById(id)
    }


    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Put("/:id")
    updateProduct(@Param("id", ParseIntPipe) id: number, @Request() req){
        return this.productService.updateProduct(id, req)
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Delete("/:id")
    deleteProduct(@Param("id", ParseIntPipe) id: number, @Request() req){
        return this.productService.deleteProduct(id, req)
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post("/buy")
    buy(@Body() product:BuyProductDto, @Request() req){
        return this.productService.buy(product, req)
    }
}


