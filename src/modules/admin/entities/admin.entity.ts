import { User } from 'src/modules/user/entities/user.entity';
import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Admin {
  @PrimaryColumn()
  userId: number;

  @OneToOne(() => User, (user) => user.admin)
  @JoinColumn()
  user: User;
}
