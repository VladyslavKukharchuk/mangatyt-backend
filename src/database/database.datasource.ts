import { DataSource } from 'typeorm';
import ormConfig from '@common/config/orm.config';

async function buildDataSource() {
  return new DataSource(await ormConfig);
}
export default buildDataSource();
