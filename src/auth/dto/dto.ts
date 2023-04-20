import { IsNumber, IsString } from "class-validator";

export class createUserDto{

    @IsString()
    username: string;

    @IsString()
    password: string;

    @IsString()
    role: string;
}

export class LoginDto{

    @IsString()
    username: string;

    @IsString()
    password: string;
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
    username: string;

    @IsNumber()
    deposit: number;

    @IsString()
    role: string;
}