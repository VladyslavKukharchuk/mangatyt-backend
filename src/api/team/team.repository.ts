import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TeamModel } from './team.model';
import { BaseRepository } from '@common/repository/base.repository.abstract';
import { ResourcePrefix } from '@common/enum/resource.enum';

@Injectable()
class TeamRepository extends BaseRepository<TeamModel> {
  constructor(
    @InjectRepository(TeamModel)
    private repository: Repository<TeamModel>,
  ) {
    super(ResourcePrefix.TEAM, repository);
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

  async getWithMembersByResourceId(resourceId: string): Promise<TeamModel> {
    const qb = this.repository
      .createQueryBuilder('teams')
      .leftJoinAndSelect('teams.members', 'members')
      .where('teams.resource_id = :resourceId', { resourceId });
    return await qb.getOne();
  }

  async getWithChaptersByResourceId(resourceId: string): Promise<TeamModel> {
    const qb = this.repository
      .createQueryBuilder('teams')
      .leftJoinAndSelect('teams.chapters', 'chapters')
      .where('teams.resource_id = :resourceId', { resourceId });
    return await qb.getOne();
  }

  async getMany(): Promise<TeamModel[]> {
    const qb = this.repository.createQueryBuilder('teams');
    return qb.getMany();
  }
}

export default TeamRepository;
