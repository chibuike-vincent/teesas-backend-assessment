import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { verifyPassword } from '../utils/verifyPassword';
import { hashPassword } from '../utils/hashPassword';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(username: string, password: string, role: string) {
    try {
      const user = await this.userService.findOne(username);

      if (user) {
        throw new ConflictException('User name already taken!');
      }
      const hashPass = await hashPassword(password);

      return await this.userService.create(username, hashPass, role);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async signIn(username, password) {
    try {
      const user = await this.userService.findOne(username);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const validPass = await verifyPassword(password, user.password);

      if (!validPass) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = {
        username: user.username,
        sub: user.id,
        role: user.role,
      };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getUsers() {
    return await this.userService.getUsers();
  }

  async updateUser(id, data) {
    return await this.userService.updateUser(id, data);
  }

  async deleteUser(id) {
    return await this.userService.deleteUser(id);
  }

  async getProfile(req) {
    return await this.userService.getUserProfile(req);
  }

  async depositCoin(coins, req) {
    return await this.userService.depositCoin(coins, req);
  }

  async resetDeposit(req) {
    return await this.userService.resetDeposit(req);
  }
}
