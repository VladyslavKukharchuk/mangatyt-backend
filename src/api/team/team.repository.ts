import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@src/database/base.repository.abstract';
import { TeamModel } from './team.model';

@Injectable()
class TeamRepository extends BaseRepository<TeamModel> {
  constructor(
    @InjectRepository(TeamModel)
    private repository: Repository<TeamModel>,
  ) {
    super(repository);
  }

  async getByResourceId(resourceId: string): Promise<TeamModel> {
    const qb = this.repository
      .createQueryBuilder('teams')
      .where('teams.resource_id = :resourceId', { resourceId });
    return await qb.getOne();
  }

  async getWithTitlesByResourceId(resourceId: string): Promise<TeamModel> {
    const qb = this.repository
      .createQueryBuilder('teams')
      .leftJoinAndSelect('teams.titles', 'titles')
      .where('teams.resource_id = :resourceId', { resourceId });
    return await qb.getOne();
  }

  async getMany(): Promise<TeamModel[]> {
    const qb = this.repository.createQueryBuilder('teams');
    return qb.getMany();
  }
}

export default TeamRepository;
