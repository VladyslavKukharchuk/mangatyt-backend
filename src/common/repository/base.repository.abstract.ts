import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { ResourcePrefix } from '@src/common/enum/resource.enum';
import { v4 as uuidv4 } from 'uuid';
import SupportModel from '@common/model/support.abstract.model';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class BaseRepository<T extends SupportModel> {
  public db: Repository<T>;
  protected prefix: ResourcePrefix;

  protected constructor(
    prefix: ResourcePrefix,
    usersRepository: Repository<T>,
  ) {
    this.db = usersRepository;
    this.prefix = prefix;
  }
  newResourceId() {
    return `${this.prefix}-${uuidv4()}`;
  }

  async findOneBy(where: FindOptionsWhere<T>): Promise<T | null> {
    return this.db.findOneBy(where);
  }

  async findBy(where: FindOptionsWhere<T>) {
    return this.db.findBy(where);
  }

  async findAndCount(options?: FindManyOptions<T>) {
    return this.db.findAndCount(options);
  }

  async clear() {
    return this.db.clear();
  }

  async delete(criteria) {
    return this.db.delete({ resourceId: criteria });
  }

  async updateById(
    id: number,
    updatedObject: QueryDeepPartialEntity<T>,
  ): Promise<T> {
    const query = {
      id: id,
    };
    await this.db.update(query as FindOptionsWhere<T>, updatedObject);
    return this.db.findOne(query as FindOneOptions<T>);
  }

  async saveNewOrUpdatedModel(entity: T): Promise<T> {
    return this.db.save(entity);
  }
}
