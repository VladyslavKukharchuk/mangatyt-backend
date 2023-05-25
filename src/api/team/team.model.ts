import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import BaseModel from '@common/model/base.abstract.model';
import { UserModel } from '@api/user/user.model';
import { TitleModel } from '@api/title/title.model';
import { ChapterModel } from '@api/chapter/chapter.model';

@Entity({ name: 'teams' })
export class TeamModel extends BaseModel {
  @Column({ type: 'text', nullable: true })
  cover?: string;

  @Column({ type: 'text', unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  telegram?: string;

  @Column({ nullable: true })
  discord?: string;

  @ManyToMany(() => UserModel, (user) => user.teams)
  members: UserModel[];

  @ManyToMany(() => TitleModel, (title) => title.translators)
  titles: TitleModel[];

  @OneToMany(() => ChapterModel, (chapter) => chapter.translator)
  chapters: ChapterModel[];
}
