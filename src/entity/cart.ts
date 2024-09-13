import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  Column,
} from "typeorm";

import { User, Product } from "./";

@Entity()
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne((type) => User, (user) => user.cart)
  user!: User;

  @ManyToOne((type) => Product, (product) => product.cart)
  product!: Product;
}
