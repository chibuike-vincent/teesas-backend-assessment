import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { User } from '../database/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../database/entities/product.entity';
import { TestModule } from '../../test/testing.module';
import { JwtModule } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

jest.setTimeout(300000);

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;
  let userRepository: Repository<User>;
  let productRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: `${process.env.JWT_SECRET}`,
          signOptions: { expiresIn: '1d' },
        }),
        TypeOrmModule.forFeature([Product, User]),
        TestModule,
      ],
      controllers: [ProductController],
      providers: [
        ProductService,
        {
          provide: User,
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: Product,
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
    userRepository = module.get<Repository<User>>('UserRepository');
    productRepository = module.get<Repository<Product>>('ProductRepository');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should buy a product successfully and return change', async () => {
    // Mock dependencies
    const user = new User();
    user.id = 1;
    user.deposit = 500;
    user.username = 'Peter';
    user.password = 'password';
    user.role = 'buyer';
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

    const product = new Product();
    product.id = 1;
    product.cost = 200;
    jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);

    // Call buy method with test data
    const result = await productService.buy(
      { productId: 1, amount: 2 },
      { user: { sub: 1, role: 'buyer' } },
    );

    // Assert result
    expect(result.totalSpent).toEqual(400);
    expect(result.productsPurchased).toEqual(2);
    expect(result.change).toEqual([100]);
  });

  it('should throw an error if user has insufficient balance', async () => {
    // Mock dependencies
    const user = new User();
    user.id = 1;
    user.deposit = 500;
    user.role = 'buyer';
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

    const product = new Product();
    product.id = 1;
    product.cost = 1000;
    jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);

    // Call buy method with test data
    try {
      await productService.buy(
        { productId: 1, amount: 1 },
        { user: { sub: 1, role: 'buyer' } },
      );
    } catch (error) {
      // Assert that the correct error is thrown
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('Insufficient balance');
      expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
    }
  });
});
