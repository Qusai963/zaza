import { Language } from 'src/modules/language/entities/language.entity';
import { TextContent } from 'src/modules/text-content/entities/text-content.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
@Entity()
export class Translation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 5 })
  code: string;

  @Column()
  textContentId: number;

  @Column({ length: 45 })
  translation: string;

  @ManyToOne(() => Language, (language) => language.translations)
  @JoinColumn()
  language: Language;

  @ManyToOne(() => TextContent, (textContent) => textContent.translations)
  textContent: TextContent;
}
