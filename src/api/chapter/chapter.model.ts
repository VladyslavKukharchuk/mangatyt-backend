import { Column, Entity, ManyToOne } from 'typeorm';
import BaseModel from '@common/model/base.abstract.model';
import { TitleModel } from '@api/title/title.model';
import { TeamModel } from '@api/team/team.model';

@Entity({ name: 'chapters' })
export class ChapterModel extends BaseModel {
  @Column({ type: 'integer' })
  volume: number;

  @Column({ type: 'integer' })
  number: number;

  @Column({ type: 'text', nullable: true })
  ukrainianName?: string;

  @Column({ type: 'text', nullable: true })
  englishName?: string;

  @Column({ type: 'text', nullable: true })
  originalName?: string;

  @ManyToOne(() => TitleModel, (title) => title.authors)
  title: TitleModel;

  @Column({ type: 'text', array: true, nullable: true, default: [] })
  pages: string[];

  @ManyToOne(() => TeamModel, (team) => team.chapters)
  translator: TeamModel;
}
