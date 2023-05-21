import { DataSourceOptions } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import SecretsService from '@common/config/secrets.service';
import { Environment } from '@common/enum/env.enum';

ConfigModule.forRoot({});
const secretsService = new SecretsService();
async function buildWithSecrets(ormConfig) {
  const env = process.env.ENV_NAME;

  if (env !== Environment.LOCAL) {
    await secretsService.init();
    const dbSecrets = secretsService.getDbSecrets();
    ormConfig.host ??= dbSecrets.host;
    ormConfig.port ??= dbSecrets.port;
    ormConfig.username ??= dbSecrets.username;
    ormConfig.password ??= dbSecrets.password;
    ormConfig.database ??= dbSecrets.dbname;
  }
  return ormConfig;
}

const typeOrmModuleOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [join('./dist/', '**', '*.model.{ts,js}')],
  synchronize: false,
  logging: ['warn', 'error'],
};

const ormConfig = {
  ...typeOrmModuleOptions,
  autoLoadEntities: true,
  migrationsTableName: 'migrations',
  migrations: ['dist/database/migrations/*.js'],
};

export default buildWithSecrets(ormConfig);
