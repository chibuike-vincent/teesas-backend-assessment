import { IsNumber, IsString } from "class-validator";

export class CreateProductDto{

    @IsString()
    productName: string;

    @IsNumber()
    cost: number;

    @IsNumber()
    amountAvailable: number;
}

export class BuyProductDto{

    @IsNumber()
    productId: number;

    @IsNumber()
    amount: number;
}

export class ProductResponseDto{

    @IsNumber()
    id:number;

    @IsNumber()
    sellerId: number;

    @IsString()
    productName: string;

    @IsNumber()
    cost: number;

    @IsNumber()
    amountAvailable: number;
}

export class UpdateProductDto{
    @IsString()
    productName: string;

    @IsNumber()
    cost: number;

    @IsNumber()
    amountAvailable: number;
}