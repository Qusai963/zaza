import { Language } from 'src/modules/language/entities/language.entity';
import { TextContent } from 'src/modules/text-content/entities/text-content.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
@Entity()
export class Translation {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn('varchar', { length: 5 })
  code: string;

  @PrimaryColumn()
  textContentId: number;

  @Column({ length: 45 })
  translation: string;

  @ManyToOne(() => Language, (language) => language.translations)
  @JoinColumn({ name: 'code' })
  language: Language;

  @ManyToOne(() => TextContent, (textContent) => textContent.translations)
  textContent: TextContent;
}
