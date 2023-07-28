import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class CategoryType {
  @PrimaryColumn()
  name: string;

  @OneToMany(() => Category, (category) => category.type)
  categories: Category[];
}
