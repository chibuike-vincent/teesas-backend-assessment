import { IsDefined, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto{

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    productName: string;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    cost: number;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    amountAvailable: number;
}

export class BuyProductDto{

    
    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    productId: number;

    
    @IsDefined()
    @IsNotEmpty()
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