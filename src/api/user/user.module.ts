import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './user.model';
import UserRepository from './user.repository';
import { S3Service } from '@common/integrations/s3/s3.service';
import CognitoGateway from '@common/integrations/cognito/cognito.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  controllers: [UserController],
  providers: [UserService, UserRepository, S3Service, CognitoGateway],
  exports: [UserService],
})
export class UserModule {}
