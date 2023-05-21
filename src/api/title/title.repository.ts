import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@src/database/base.repository.abstract';
import { TitleModel } from './title.model';

@Injectable()
class TitleRepository extends BaseRepository<TitleModel> {
  constructor(
    @InjectRepository(TitleModel)
    private repository: Repository<TitleModel>,
  ) {
    super(repository);
  }

  async getByResourceId(resourceId: string): Promise<TitleModel> {
    const qb = this.repository
      .createQueryBuilder('titles')
      .where('titles.resource_id = :resourceId', { resourceId });
    return await qb.getOne();
  }

  async getWithChaptersByResourceId(resourceId: string): Promise<TitleModel> {
    const qb = this.repository
      .createQueryBuilder('titles')
      .leftJoinAndSelect('titles.chapters', 'chapters')
      .where('titles.resource_id = :resourceId', { resourceId });
    return await qb.getOne();
  }

  async getMany(): Promise<TitleModel[]> {
    const qb = this.repository.createQueryBuilder('titles');
    return qb.getMany();
  }
}

export default TitleRepository;
