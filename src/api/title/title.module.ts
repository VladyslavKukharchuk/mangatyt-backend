import { Module } from '@nestjs/common';
import { TitleService } from './title.service';
import { TitleController } from './title.controller';
import { TitleModel } from './title.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import TitleRepository from './title.repository';
import { AuthorModel } from '@api/author/author.model';
import { S3Service } from '@common/integrations/s3/s3.service';
import { TeamModel } from '@api/team/team.model';
import { TeamModule } from '@api/team/team.module';
import { AuthorModule } from '@api/author/author.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TitleModel, AuthorModel, TeamModel]),
    TeamModule,
    AuthorModule,
  ],
  controllers: [TitleController],
  providers: [TitleService, TitleRepository, S3Service],
  exports: [TitleService],
})
export class TitleModule {}
