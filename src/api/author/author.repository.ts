import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { AuthorModel } from "./author.model";
import { BaseRepository } from "@common/repository/base.repository.abstract";
import { ResourcePrefix } from "@common/enum/resource.enum";

@Injectable()
class AuthorRepository extends BaseRepository<AuthorModel> {
  constructor(
    @InjectRepository(AuthorModel)
    private repository: Repository<AuthorModel>,
  ) {
    super(ResourcePrefix.AUTHOR, repository);
  }

  async getByResourceId(resourceId: string): Promise<AuthorModel> {
    const qb = this.repository
      .createQueryBuilder('authors')
      .leftJoinAndSelect('authors.titles', 'titles')
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
