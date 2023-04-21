import { ArrayNotEmpty, IsArray, IsDefined, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export enum UserRole{
    BUYER = "buyer",
    SELLER = "seller"
}
export class createUserDto{

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    password: string;

    @IsDefined()
    @IsNotEmpty()
    @IsEnum(UserRole, { message: 'Role should be either buyer or seller' })
    role: UserRole;
}

export class LoginDto{

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    password: string;
}

export class DepositDto{

    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true, message: 'Each item in coins should be a number' })
    coins: number[];
}

export class UserResponseDto{

    @IsNumber()
    id:number;

    @IsString()
    username: string;

    @IsNumber()
    deposit: number;

    @IsString()
    role: string;
}

export class UpdateUserDto{

    @IsString()
    @IsOptional()
    username: string;

    @IsNumber()
    @IsOptional()
    deposit: number;

    @IsString()
    @IsOptional()
    role: UserRole;
}