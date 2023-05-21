import { Module } from '@nestjs/common';
import { TitleService } from './title.service';
import { TitleController } from './title.controller';
import { TitleModel } from './title.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorService } from '@api/author/author.service';
import TitleRepository from './title.repository';
import AuthorRepository from '@api/author/author.repository';
import { AuthorModel } from '@api/author/author.model';
import { S3Service } from '@common/integrations/s3/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([TitleModel, AuthorModel])],
  controllers: [TitleController],
  providers: [
    TitleService,
    TitleRepository,
    AuthorService,
    AuthorRepository,
    S3Service,
  ],
  exports: [TitleService],
})
export class TitleModule {}
