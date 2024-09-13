import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import { LogProduct, LogUser, Cart, LogClickProduct } from "./";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  loginId: string;

  @Column()
  name: string;

  @Column()
  maxName: string;

  @Column({ type: "json", nullable: true })
  info: object;

  @Column({ length: 600 })
  atomyJwtRefresh: string;

  @Column({ length: 600 })
  atomyJwt: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany((type) => LogProduct, (logProduct) => logProduct.user)
  logProduct: LogProduct[];

  @OneToMany((type) => LogUser, (logUser) => logUser.user)
  logUser: LogUser[];

  @OneToMany((type) => Cart, (cart) => cart.user)
  cart: Cart[];

  @OneToMany(
    (type) => LogClickProduct,
    (logClickProduct) => logClickProduct.user
  )
  logClickProduct: LogClickProduct[];
}
