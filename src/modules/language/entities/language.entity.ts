import { TextContent } from 'src/modules/text-content/entities/text-content.entity';
import { Translation } from 'src/modules/translation/entities/translation.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('languages')
export class Language {
  @PrimaryColumn('varchar', { length: 5 })
  code: string;

  @Column('varchar', { length: 45 })
  name: string;

  @OneToMany(() => TextContent, (textContent) => textContent.language)
  textContents: TextContent[];

  @OneToMany(() => Translation, (translation) => translation.language)
  translations: Translation[];
}
