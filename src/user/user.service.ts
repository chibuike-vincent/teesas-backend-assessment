import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { UserResponseDto } from '../auth/dto/dto';
import { checkBuyerRole } from '../utils/validateRole';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User> {
    try {
      return await this.userRepository.findOne({
        where: { username: username },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async create(
    username: string,
    password: string,
    role: string,
  ): Promise<User> {
    try {
      const user = await this.userRepository.save({
        username,
        password,
        role,
      });

      delete user.password;
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getUsers(): Promise<UserResponseDto[]> {
    try {
      const users = await this.userRepository.find({});
      return users;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateUser(id, data): Promise<User | any> {
    try {
      await this.userRepository.update({ id: id }, { ...data });
      return {
        message: 'Success',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteUser(id): Promise<User | any> {
    try {
      await this.userRepository.delete({ id: id });
      return {
        message: 'Success',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getUserProfile(req): Promise<User | any> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: req.user.sub },
      });
      delete user.password;
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async depositCoin(body, req): Promise<any> {
    try {
      await checkBuyerRole(req);

      const acceptedCoins = [5, 10, 20, 50, 100];

      const user = await this.userRepository.findOne({
        where: { id: req.user.sub },
      });

      const { coins } = body;
      // Validate deposited coins
      for (const coin of coins) {
        if (!acceptedCoins.includes(coin)) {
          throw new BadRequestException('Invalid coin');
        }
      }

      // Add deposited coins to user's balance
      user.deposit += coins.reduce((sum, coin) => sum + coin, 0);

      await this.userRepository.save(user);

      return { message: 'Deposited successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async resetDeposit(req): Promise<any> {
    try {
      await checkBuyerRole(req);

      await this.userRepository.update({ id: req.user.sub }, { deposit: 0 });

      return { message: 'Deposit successfully reset' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
