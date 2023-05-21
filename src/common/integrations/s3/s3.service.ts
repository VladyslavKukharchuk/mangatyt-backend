import { Injectable } from '@nestjs/common';
import {
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import * as process from 'process';

@Injectable()
export class S3Service {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({});
  }

  async putOne(file: Express.Multer.File): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Body: file.buffer,
      Key: file.originalname,
    });

    await this.s3.send(command).catch((err) => {
      throw new Error(err.message);
    });

    return process.env.S3_BUCKET_URL + file.originalname;
  }

  async putMany(files: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises = files.map((file) => {
      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Body: file.buffer,
        Key: file.originalname,
      });

      return this.s3.send(command);
    });

    await Promise.all(uploadPromises).catch((err) => {
      throw new Error(err.message);
    });

    const urls: string[] = files.map((file) => {
      return process.env.S3_BUCKET_URL + file.originalname;
    });

    return urls;
  }

  // public async getObject(bucket: string, key: string) {
  //   const command = new GetObjectCommand({
  //     Bucket: bucket,
  //     Key: key,
  //   });
  //
  //   return await this.s3
  //     .send(command)
  //     // @ts-ignore
  //     .then((data) => data.Body.transformToString())
  //     .catch((err) => {
  //       throw new Error(err.message);
  //     });
  // }

  async deleteOne(url: string) {
    const key = url.replace(process.env.S3_BUCKET_URL, '');

    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    });

    return await this.s3.send(command).catch((err) => {
      throw new Error(err.message);
    });
  }

  async deleteMany(urlsArr: string[]) {
    const keyArr = urlsArr.map((item) => ({
      Key: item.replace(process.env.S3_BUCKET_URL, ''),
    }));

    const command = new DeleteObjectsCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Delete: {
        Objects: keyArr,
      },
    });

    return await this.s3.send(command).catch((err) => {
      throw new Error(err.message);
    });
  }
}
