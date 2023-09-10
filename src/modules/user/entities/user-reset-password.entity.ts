import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Global } from '@nestjs/common';

@Entity()
export class UserResetPassword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  resetToken: string;

  @Column()
  userId: number;

  @Column()
  resetTokenExpire: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => User, (user) => user.userResetPassword, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
