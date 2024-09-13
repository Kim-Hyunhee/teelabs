import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  Column,
} from "typeorm";

import { Product, Location } from "./";

@Entity()
export class ProductLocation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  position: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne((type) => Location, (location) => location.ProductLocation)
  location!: Location;

  @ManyToOne((type) => Product, (product) => product.ProductLocation)
  product!: Product;
}
