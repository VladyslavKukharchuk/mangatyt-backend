import { Module } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ChapterController } from './chapter.controller';
import ChapterRepository from './chapter.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChapterModel } from './chapter.model';
import { TitleService } from '@api/title/title.service';
import TitleRepository from '@api/title/title.repository';
import { TitleModel } from '@api/title/title.model';
import { AuthorModule } from '@api/author/author.module';
import { S3Service } from '@common/integrations/s3/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChapterModel, TitleModel]), AuthorModule],
  controllers: [ChapterController],
  providers: [
    ChapterService,
    ChapterRepository,
    TitleService,
    TitleRepository,
    S3Service,
  ],
})
export class ChapterModule {}
