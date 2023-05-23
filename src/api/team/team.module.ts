import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { TeamModel } from './team.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import TeamRepository from './team.repository';
import { S3Service } from '@common/integrations/s3/s3.service';
import { UserService } from '@api/user/user.service';
import { UserModule } from '@api/user/user.module';
import { UserModel } from '@api/user/user.model';
import { S3Module } from '@common/integrations/s3/s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeamModel, UserModel]),
    UserModule,
    S3Module,
  ],
  controllers: [TeamController],
  providers: [TeamService, TeamRepository, S3Service],
  exports: [TeamService],
})
export class TeamModule {}
