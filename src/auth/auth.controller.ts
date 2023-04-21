import { Body, Controller,HttpCode,Request,
    UseGuards, HttpStatus, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Req } from "@nestjs/common";
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import {createUserDto, DepositDto, LoginDto, UpdateUserDto} from "./dto/dto"


@Controller('api/v1/users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  signUp(@Body() body: createUserDto) {
    return this.authService.signUp(body.username, body.password, body.role);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() body: LoginDto) {
     
    return this.authService.signIn(body.username, body.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getUserById(@Request() req){
      return this.authService.getProfile(req)
  }

  @UseGuards(AuthGuard)
  @Get()
  getUsers(){
      return this.authService.getUsers()
  }


  @UseGuards(AuthGuard)
  @Put("/:id")
  updateUser(@Param("id", ParseIntPipe) id: number, @Body() data:UpdateUserDto){
      return this.authService.updateUser(id, data)
  }


  @UseGuards(AuthGuard)
  @Delete("/:id")
  deleteUser(@Param("id", ParseIntPipe) id: number){
      return this.authService.deleteUser(id)
  }

  @UseGuards(AuthGuard)
  @Post("/deposit")
  depositCoin(@Body() coins: DepositDto, @Request() req){
    return this.authService.depositCoin(coins,req)
  }

  @UseGuards(AuthGuard)
  @Post("/reset")
  resetDeposit(@Request() req){
    return this.authService.resetDeposit(req)
  }

}