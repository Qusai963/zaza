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

  @Column('char', { length: 5 })
  languageCode: string;

  @Column()
  textContentId: number;

  @Column()
  translation: string;

  @ManyToOne(() => Language, (language) => language.translations)
  @JoinColumn()
  language: Language;

  @ManyToOne(() => TextContent, (textContent) => textContent.translations)
  textContent: TextContent;
}
