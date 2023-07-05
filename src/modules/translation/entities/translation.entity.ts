import { Language } from 'src/modules/language/entities/language.entity';
import { TextContent } from 'src/modules/text-content/entities/text-content.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
@Entity()
export class Translation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  language_code: string;

  @Column()
  text_content_id: number;

  @Column()
  translation: string;

  @ManyToOne(() => Language, (language) => language.translations)
  language: Language;

  @ManyToOne(() => TextContent, (textContent) => textContent.translations)
  textContent: TextContent;
}
