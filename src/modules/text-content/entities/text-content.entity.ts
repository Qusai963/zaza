import { Category } from 'src/modules/category/entities/category.entity';
import { Language } from 'src/modules/language/entities/language.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { Tax } from 'src/modules/tax/entities/tax.entity';
import { Translation } from 'src/modules/translation/entities/translation.entity';
import { Unit } from 'src/modules/unit/entities/unit.entity';
import {
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
@Entity()
export class TextContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalText: string;

  @ManyToOne(() => Language, (language) => language.textContents)
  @JoinColumn({ name: 'code' })
  language: Language;

  @Column('varchar', { length: 5, default: 'de' })
  code: string;

  @OneToMany(() => Category, (category) => category.textContent)
  categories: Category[];

  @OneToMany(() => Product, (product) => product.textContent)
  products: Product[];

  @OneToMany(() => Translation, (translation) => translation.textContent, {
    onDelete: 'CASCADE',
  })
  translations: Translation[];

  @OneToMany(() => Tax, (tax) => tax.textContent)
  taxes: Tax[];

  @OneToMany(() => Unit, (unit) => unit.textContent)
  units: Unit[];
}
