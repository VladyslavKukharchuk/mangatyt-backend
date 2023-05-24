import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserModel } from './user.model';
import { BaseRepository } from '@common/repository/base.repository.abstract';
import { ResourcePrefix } from '@common/enum/resource.enum';

@Injectable()
class UserRepository extends BaseRepository<UserModel> {
  constructor(
    @InjectRepository(UserModel)
    private repository: Repository<UserModel>,
  ) {
    super(ResourcePrefix.USER, repository);
  }

  async create({
    sub,
    email,
    username,
  }: {
    sub: string;
    email: string;
    username: string;
  }): Promise<UserModel> {
    const newUser = new UserModel();

    newUser.sub = sub;
    newUser.email = email;
    newUser.username = username;
    newUser.resourceId = this.newResourceId();

    return newUser.save();
  }

  async getUserByEmail(email: string): Promise<UserModel> {
    const qb = this.repository
      .createQueryBuilder('users')
      .where('users.email = :email', { email });
    return await qb.getOne();
  }

  async getUserByUsername(username: string): Promise<UserModel> {
    const qb = this.repository
      .createQueryBuilder('users')
      .where('users.username = :username', { username });
    return await qb.getOne();
  }

  async getUserBySub(userSub: string): Promise<UserModel> {
    return this.repository
      .createQueryBuilder('users')
      .where('users.sub = :sub', { sub: userSub })
      .getOne();
  }

  async getUserByResourceId(resourceId: string): Promise<UserModel> {
    const qb = this.repository
      .createQueryBuilder('users')
      .where('users.resource_id = :resourceId', { resourceId });
    return await qb.getOne();
  }

  async getMany(): Promise<UserModel[]> {
    const qb = this.repository.createQueryBuilder('users');
    return qb.getMany();
  }
}

export default UserRepository;
