import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@src/database/base.repository.abstract';
import { ChapterModel } from './chapter.model';

@Injectable()
class ChapterRepository extends BaseRepository<ChapterModel> {
  constructor(
    @InjectRepository(ChapterModel)
    private repository: Repository<ChapterModel>,
  ) {
    super(repository);
  }

  async getByResourceId(resourceId: string): Promise<ChapterModel> {
    const qb = this.repository
      .createQueryBuilder('chapters')
      .leftJoinAndSelect('chapters.title', 'title')
      .leftJoinAndSelect('chapters.translator', 'translator')
      .where('chapters.resource_id = :resourceId', { resourceId });
    return await qb.getOne();
  }

  async getMany(): Promise<ChapterModel[]> {
    const qb = this.repository.createQueryBuilder('chapters');
    return qb.getMany();
  }
}

export default ChapterRepository;
