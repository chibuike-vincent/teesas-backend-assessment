import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sellerId: number;

  @Column()
  productName: string;

  @Column()
  cost: number;

  @Column()
  amountAvailable: number;
}
