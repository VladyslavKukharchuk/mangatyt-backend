import { Column, Entity, ManyToMany } from 'typeorm';
import BaseModel from '@common/model/base.abstract.model';
import { TeamModel } from '@api/team/team.model';

@Entity({ name: 'users' })
export class UserModel extends BaseModel {
  @Column({
    nullable: true,
  })
  avatar: string;

  @Column({
    unique: true,
  })
  sub: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    unique: true,
  })
  username: string;

  @ManyToMany(() => TeamModel, (team) => team.members)
  teams: TeamModel[];
}
