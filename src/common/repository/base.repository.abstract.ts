import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { ResourcePrefix } from '@src/common/enum/resource.enum';
import { v4 as uuidv4 } from 'uuid';

export abstract class BaseRepository<T> {
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
    return this.db.delete(criteria);
  }

  async saveNewOrUpdatedModel(entity: T): Promise<T> {
    return this.db.save(entity);
  }
}
