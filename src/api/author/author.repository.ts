import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@src/database/base.repository.abstract';
import { AuthorModel } from './author.model';

@Injectable()
class AuthorRepository extends BaseRepository<AuthorModel> {
  constructor(
    @InjectRepository(AuthorModel)
    private repository: Repository<AuthorModel>,
  ) {
    super(repository);
  }

  async getByResourceId(resourceId: string): Promise<AuthorModel> {
    const qb = this.repository
      .createQueryBuilder('authors')
      .where('authors.resource_id = :resourceId', { resourceId });
    return await qb.getOne();
  }

  // async getWithTitlesByResourceId(resourceId: string): Promise<AuthorModel> {
  //   const qb = this.repository
  //     .createQueryBuilder('authors')
  //     .leftJoinAndSelect('authors.titles', 'titles')
  //     .where('authors.resource_id = :resourceId', { resourceId });
  //   return await qb.getOne();
  // }
  async getWithTitlesByResourceId(resourceId: string): Promise<AuthorModel> {
    const qb = this.repository
      .createQueryBuilder('authors')
      .leftJoinAndSelect('authors.titles', 'titles')
      .where('authors.resource_id = :resourceId', { resourceId });
    return await qb.getOne();
  }

  async getMany(): Promise<AuthorModel[]> {
    const qb = this.repository.createQueryBuilder('authors');
    return qb.getMany();
  }
}

export default AuthorRepository;
