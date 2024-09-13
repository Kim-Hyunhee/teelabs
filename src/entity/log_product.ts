import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
} from "typeorm";

import { Product, User } from ".";

@Entity()
export class LogProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne((type) => Product, (product) => product.logProduct)
  product!: Product;

  @ManyToOne((type) => User, (user) => user.logProduct)
  user!: User;
}
