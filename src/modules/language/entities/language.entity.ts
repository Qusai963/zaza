import { TextContent } from 'src/modules/text-content/entities/text-content.entity';
import { Translation } from 'src/modules/translation/entities/translation.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Language {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;

  @OneToMany(() => TextContent, (textContent) => textContent.language)
  textContents: TextContent[];

  @OneToMany(() => Translation, (translation) => translation.language)
  translations: Translation[];
}
