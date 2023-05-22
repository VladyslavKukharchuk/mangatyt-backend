import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { TeamModel } from './team.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import TeamRepository from './team.repository';
import { S3Service } from '@common/integrations/s3/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([TeamModel])],
  controllers: [TeamController],
  providers: [TeamService, TeamRepository, S3Service],
  exports: [TeamService],
})
export class TeamModule {}
