import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import {UserResponseDto} from "../auth/dto/dto"
import {checkBuyerRole} from "../utils/validateRole"


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}


  async findOne(username:string):Promise<User> {
    return await this.userRepository.findOne( { where:{ username: username }});
}

async create(username:string, password:string, role:string):Promise<User> {
    const user = await this.userRepository.save({
        username, password, role
    });

    delete user.password
    return user;
}

async getUsers():Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({});
    return users
}

async updateUser(id, data):Promise<User | any> {
    await this.userRepository.update({id: id}, {...data});
    return {
        message: "Success"
    }
}

async deleteUser(id):Promise<User | any>{
    await this.userRepository.delete({id:id})
    return {
        message: "Success"
    }
}

async getUserProfile(req):Promise<User | any> {
    const user = await this.userRepository.findOne({where: {id: req.sub}})
    delete user.password
    return user
}

async depositCoin(body,req):Promise<any> {
    await checkBuyerRole(req)

    const acceptedCoins = [5, 10, 20, 50, 100];

    const user = await this.userRepository.findOne({where: {id: req.user.sub}})

    const {coins} = body
    // Validate deposited coins
    for (const coin of coins) {
      if (!acceptedCoins.includes(coin)) {
        throw new BadRequestException("Invalid coin");
      }
    }
  
    // Add deposited coins to user's balance
    user.deposit += coins.reduce((sum, coin) => sum + coin, 0);

    await this.userRepository.save(user)

    return { message: 'Deposited successfully' }
    
}

async resetDeposit(req):Promise<any> {
    await checkBuyerRole(req)

    await this.userRepository.update({id: req.user.sub}, {deposit: 0});

    return { message: 'Deposit successfully reset' }
    
}

}