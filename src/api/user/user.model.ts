import { Column, Entity } from 'typeorm';
import BaseModel from '@common/model/base.abstract.model';

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
}
