import { Column, Entity, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import BaseModel from '@common/model/base.abstract.model';
import { TitleType } from '@api/title/enum/title-type.enum';
import { TitleStatus } from '@api/title/enum/title-status.enum';
import { TitleTranslateStatus } from '@api/title/enum/title-translate-status.enum';
import { AuthorModel } from '@api/author/author.model';
import { ChapterModel } from '@api/chapter/chapter.model';

@Entity({ name: 'titles' })
export class TitleModel extends BaseModel {
  @Column({ type: 'text', nullable: true })
  cover: string;

  @Column({ type: 'text', unique: true })
  ukrainianName: string;

  @Column({ type: 'text', unique: true })
  englishName: string;

  @Column({ type: 'text', nullable: true, unique: true })
  originalName?: string;

  @Column({
    type: 'enum',
    enum: TitleType,
  })
  type: TitleType;

  @Column({ type: 'integer' })
  year: number;

  @Column({
    type: 'enum',
    enum: TitleStatus,
  })
  status: TitleStatus;

  @Column({
    type: 'enum',
    enum: TitleTranslateStatus,
  })
  translateStatus: TitleTranslateStatus;

  @ManyToMany(() => AuthorModel, (author) => author.titles)
  @JoinTable()
  authors: AuthorModel[];

  @Column({ type: 'text' })
  description: string;

  // Коментарі до тайтлу, звʼязок багато до багатьох
  // comments: ;

  // Обраховується на основі оцінок користувачів
  // rating: ;

  // Енам що містить самив тегів які відповідають тайтлу
  // tags: ;

  // Перекладачі що робили переклад тайтлу, звʼязок багато до багатьох
  // translators: ;

  // Повʼязані тайтли, звʼязок багато до багатьох
  // related: ;

  // Схожі тайтли, звʼязок багато до багатьох
  // similar: ;

  @OneToMany(() => ChapterModel, (chapter) => chapter.title)
  chapters?: ChapterModel[];

  public convertEnglishNameToLink() {
    return this.englishName.toLowerCase().replace(/ /g, '-');
  }
}
