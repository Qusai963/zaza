import { User } from 'src/modules/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
@Entity()
export class Phone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: string;

  @Column()
  code: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.phones, {
    onDelete: 'CASCADE',
  })
  user: User;
}
