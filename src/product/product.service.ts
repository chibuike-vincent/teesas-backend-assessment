import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../database/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto, ProductResponseDto } from './dto/dto';
import { checkSellerRole, checkBuyerRole } from '../utils/validateRole';
import { User } from '../database/entities/user.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getProducts(): Promise<ProductResponseDto[]> {
    try {
      return await this.productRepository.find({});
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createProduct(
    requestBody: CreateProductDto,
    req,
  ): Promise<Product | any> {
    try {
      await checkSellerRole(req);
      const user = req.user;
      const { productName, cost, amountAvailable } = requestBody;
      const createdProduct = await this.productRepository.save({
        productName,
        cost,
        amountAvailable,
        sellerId: user.sub,
      });
      return createdProduct;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateProduct(id, req): Promise<Product | any> {
    try {
      await checkSellerRole(req);
      const { body, user } = req;
      const prod =  await this.productRepository.findOne({where: { id: id, sellerId: user.sub} });
     if(prod){
        await this.productRepository.update(
          { id: id, sellerId: user.sub },
          { ...body },
        );
        return {
          message: 'Success',
        };
     }else{
        throw new UnauthorizedException('You are not authorized to perform this action'); 
     }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteProduct(id, req): Promise<Product | any> {
    try {
      await checkSellerRole(req);
      const prod =  await this.productRepository.findOne({where: { id: id, sellerId: req.user.sub} });

      if(prod){
        await this.productRepository.delete({ id: id, sellerId: req.user.sub });
        return {
            message: 'Success',
        };
      }else{
        throw new UnauthorizedException('You are not authorized to perform this action'); 
      }
      
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getProductById(id: number): Promise<Product | any> {
    try {
      const product = await this.productRepository.findOne({
        where: {
          id,
        },
      });
      return product;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async buy(prod, req): Promise<any> {
    try {
      await checkBuyerRole(req);

      // Get user Info
      const user = await this.userRepository.findOne({
        where: { id: req.user.sub },
      });

      // Get product ID and amount from request body
      const productId = prod.productId;
      const amount = prod.amount;

      const product = await this.productRepository.findOne({
        where: {
          id: productId,
        },
      });

      // Get product price from a database or other source
      const productPrice = product.cost; // in cents

      // Calculate total price and check if user has enough balance
      const totalPrice = productPrice * amount;
      if (user.deposit < totalPrice) {
        throw new HttpException('Insufficient balance', HttpStatus.BAD_REQUEST);
      }

      // Update user's balance and calculate change
      const change = user.deposit - totalPrice;
      user.deposit = change;

      // Convert change to an array of coins
      const coinDenominations = [100, 50, 20, 10, 5];
      const changeCoins = [];
      let remainingChange = change;
      for (const coin of coinDenominations) {
        const numCoins = Math.floor(remainingChange / coin);
        remainingChange -= numCoins * coin;
        for (let i = 0; i < numCoins; i++) {
          changeCoins.push(coin);
        }
      }

      await this.userRepository.save(user);

      return {
        totalSpent: totalPrice,
        productsPurchased: amount,
        change: changeCoins,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
