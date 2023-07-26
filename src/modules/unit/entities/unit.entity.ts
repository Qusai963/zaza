import { TextContent } from 'src/modules/text-content/entities/text-content.entity';
import {
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('units')
export class Unit {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  textContentId: number;

  @ManyToOne(() => TextContent, (textContent) => textContent.units, {
    onDelete: 'CASCADE',
  })
  textContent: TextContent;
}
