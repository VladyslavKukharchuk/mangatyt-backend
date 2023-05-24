import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TitleModel } from './title.model';
import { BaseRepository } from '@common/repository/base.repository.abstract';
import { ResourcePrefix } from '@common/enum/resource.enum';

@Injectable()
class TitleRepository extends BaseRepository<TitleModel> {
  constructor(
    @InjectRepository(TitleModel)
    private repository: Repository<TitleModel>,
  ) {
    super(ResourcePrefix.TITLE, repository);
  }

  async getByResourceId(resourceId: string): Promise<TitleModel> {
    const qb = this.repository
      .createQueryBuilder('titles')
      .leftJoinAndSelect('titles.authors', 'authors')
      .leftJoinAndSelect('titles.translators', 'translators')
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
