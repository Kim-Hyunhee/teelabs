import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import {
  Category,
  ProductLocation,
  LogProduct,
  Cart,
  LogClickProduct,
} from "./";

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  salesPerson: string;

  @Column()
  outsource: string;

  @Column()
  price: number;

  @Column({ default: "" })
  object_id: string;

  @Column()
  point: number;

  @Column({ default: 0 })
  is_show: number;

  @Column({ nullable: true, default: "" })
  company: string;

  @Column({ nullable: true, default: "" })
  serial_number: string;

  @Column({ nullable: true, default: "" })
  country: string;

  @Column({ nullable: true, default: "" })
  manufacturer: string;

  @Column({ type: "json" })
  colors: string;

  @Column({ default: "" })
  explanation: string;

  @Column({ default: "" })
  connection_url: string;

  @Column({ type: "json" })
  images: string;

  @Column({ nullable: true, default: "" })
  obj: string;

  @Column({ nullable: true, default: "" })
  mtl: string;

  @Column({ nullable: true, default: "" })
  fbx: string;

  @Column({ nullable: true, default: 0 })
  click_count: number;

  @Column()
  adReview: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(
    (type) => ProductLocation,
    (ProductLocation) => ProductLocation.product
  )
  ProductLocation: ProductLocation[];

  @ManyToOne((type) => Category, (category) => category.products)
  category!: Category;

  @OneToMany((type) => LogProduct, (logProduct) => logProduct.product)
  logProduct: LogProduct[];

  @OneToMany((type) => Cart, (cart) => cart.product)
  cart: Cart[];

  @OneToMany(
    (type) => LogClickProduct,
    (logClickProduct) => logClickProduct.product
  )
  logClickProduct: LogClickProduct[];
}
