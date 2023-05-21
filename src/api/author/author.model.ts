import { Column, Entity, ManyToMany } from 'typeorm';
import BaseModel from '@common/model/base.abstract.model';
import { TitleModel } from '@api/title/title.model';

@Entity({ name: 'authors' })
export class AuthorModel extends BaseModel {
  @Column({ type: 'text', nullable: true })
  photo?: string;

  @Column({ type: 'text', unique: true })
  englishName: string;

  @Column({ type: 'text', nullable: true, unique: true })
  ukrainianName?: string;

  @Column({ type: 'text', nullable: true, unique: true })
  originalName?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToMany(() => TitleModel, (title) => title.authors)
  titles: TitleModel[];
}
