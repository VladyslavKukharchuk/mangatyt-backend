import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import AuthorRepository from './author.repository';
import { AuthorModel } from './author.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Service } from '@common/integrations/s3/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuthorModel])],
  controllers: [AuthorController],
  providers: [AuthorService, AuthorRepository, S3Service],
  exports: [AuthorService],
})
export class AuthorModule {}
