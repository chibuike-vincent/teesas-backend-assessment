import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../database/entities/product.entity';
import { User } from '../database/entities/user.entity';
import { ProductModules } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from "./auth.service"
import { TestModule } from "../../test/testing.module"
import { BadRequestException, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';


jest.setTimeout(300000); // increase timeout to 10 seconds for all tests in this suite

describe('AuthController', () => {

  let controller: AuthController;
  let authService: AuthService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        JwtModule.register({
          secret: `${process.env.JWT_SECRET}`,
          signOptions: { expiresIn: '1d' },
        }),
        TypeOrmModule.forFeature([User]),
        TestModule
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: User,
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],

    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>('UserRepository');
  });

  enum UserRole {
    SELLER = "seller",
    BUYER = "buyer"
  }

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should deposit coins successfully', async () => {
    const mockUser = new User();
    mockUser.deposit = 0;
    mockUser.username = "James";
    mockUser.password = "mypassword";
    mockUser.role = "buyer"
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

    const result = await authService.depositCoin(
      { coins: [5, 10] },
      { user: { sub: 1, role:"buyer" } },
    );

    expect(result).toEqual({ message: 'Deposited successfully' });
    expect(mockUser.deposit).toEqual(15);
  });

  it('should throw a BadRequestException for invalid coins', async () => {
    const mockUser = new User();
    mockUser.deposit = 0;
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

    const invalidCoins = [4, 6, 9];
    try {
      await authService.depositCoin(
        { coins: invalidCoins },
        { user: { sub: 1, role:"buyer" } },
      );
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe('Invalid coin');
    }
  });

  it('should throw a BadRequestException if the user does not have the required role', async () => {
    const mockUser = new User();
    mockUser.deposit = 0;
    mockUser.username = "James";
    mockUser.role = "seller";
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

    try {
      await authService.depositCoin({ coins: [5, 10] }, { user: { sub: 1, role:"seller" } },);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe('You are not authorized to perform this action');
    }
  });
  
  it('should return the user profile without the password', async () => {
    const user = new User();
    user.id = 1;
    user.username = 'john.doe';
    user.password = 'password';
    user.deposit = 100;

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

    const req = { user: { sub: 1 } };
    const result = await authService.getProfile(req);

    expect(result).toEqual({
      id: 1,
      username: 'john.doe',
      deposit: 100,
    });
  });

  it('should throw a BadRequestException if the user cannot be found', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    const req = { user: { sub: 1 } };
    await expect(authService.getProfile(req)).rejects.toThrow(BadRequestException);
  });

  it('should re-throw any caught error as a BadRequestException', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValue(new Error('Database connection error'));

    const req = { user: { sub: 1 } };
    await expect(authService.getProfile(req)).rejects.toThrow(BadRequestException);
  });

});
