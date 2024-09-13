import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  Column,
} from "typeorm";

import { User } from ".";

export enum device {
  android = "android",
  iOS = "iOS",
  desktop = "desktop",
}

@Entity()
export class LogUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: device })
  device: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne((type) => User, (user) => user.logUser)
  user!: User;
}
