import {
  SecretsManagerClient,
  GetSecretValueCommand,
  GetSecretValueCommandInput,
  GetSecretValueCommandOutput,
} from '@aws-sdk/client-secrets-manager';
import { Injectable } from '@nestjs/common';

export type databaseSecrets = {
  password: string;
  dbname: string;
  engine: string;
  port: number;
  host: string;
  username: string;
};

@Injectable()
export default class SecretsService {
  private readonly client: SecretsManagerClient;
  private dbSecrets?: databaseSecrets;

  constructor() {
    this.client = new SecretsManagerClient({
      region: process.env.AWS_REGION,
    });
  }
  private async getSecretValue(secretName: string) {
    const secret = await this.client.send<
      GetSecretValueCommandInput,
      GetSecretValueCommandOutput
    >(
      new GetSecretValueCommand({
        SecretId: secretName,
      }),
    );

    return secret.SecretString;
  }

  private async fetchDBConnectionSecrets() {
    if (this.dbSecrets) {
      return;
    }

    const dbSecret = await this.getSecretValue(process.env.DB_SECRET_ARN);
    this.dbSecrets = JSON.parse(dbSecret);
  }

  public async init() {
    await this.fetchDBConnectionSecrets();
  }

  public getDbSecrets() {
    return this.dbSecrets;
  }
}
