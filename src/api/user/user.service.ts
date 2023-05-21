import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import UserRepository from './user.repository';
import { UserModel } from './user.model';
import { RegisterAuthDto } from '@api/auth/dto/register-auth.dto';
import { NotFoundException, ValidationException } from '@common/exceptions';
import { S3Service } from '@common/integrations/s3/s3.service';
import { DeleteResult } from 'typeorm';
import CognitoGateway from '@common/integrations/cognito/cognito.gateway';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly s3Service: S3Service,
    private readonly cognitoGateway: CognitoGateway,
  ) {}
  async create(sub: string, dto: RegisterAuthDto) {
    const { username, email } = dto;

    return await this.userRepository.create({
      sub,
      username,
      email,
    });
  }

  async findAll(): Promise<UserModel[]> {
    return await this.userRepository.getMany();
  }

  async findByResourceId(resourceId: string): Promise<UserModel> {
    const user = await this.userRepository.getUserByResourceId(resourceId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getByEmail(email: string): Promise<UserModel> {
    return await this.userRepository.getUserByEmail(email);
  }

  async getByUsername(username: string): Promise<UserModel> {
    return await this.userRepository.getUserByUsername(username);
  }

  async getBySub(sub: string): Promise<UserModel> {
    return await this.userRepository.getUserBySub(sub);
  }

  async update(
    user: UserModel,
    updateUserDto: UpdateUserDto,
  ): Promise<UserModel> {
    const updatedUser = Object.assign(user, updateUserDto);

    return await this.userRepository.saveNewOrUpdatedModel(updatedUser);
  }

  async addAvatar(
    user: UserModel,
    file: Express.Multer.File,
  ): Promise<UserModel> {
    if (!file) {
      throw new ValidationException('Request without file');
    }

    file.originalname = `users/${user.resourceId}/avatar`;

    user.avatar = await this.s3Service.putOne(file);

    return await this.userRepository.saveNewOrUpdatedModel(user);
  }

  async removeAvatar(user: UserModel): Promise<UserModel> {
    const { avatar } = user;

    if (!avatar) {
      throw new NotFoundException('Avatar not found');
    }

    await this.s3Service.deleteOne(avatar);

    user.avatar = null;

    return await this.userRepository.saveNewOrUpdatedModel(user);
  }

  async remove(accessToken: string, user: UserModel): Promise<DeleteResult> {
    const { avatar, resourceId } = user;

    if (avatar) {
      await this.s3Service.deleteOne(avatar);
    }

    await this.cognitoGateway.deleteUser(accessToken);

    const deleted = await this.userRepository.delete(resourceId);

    if (!deleted.affected) {
      throw new NotFoundException('Chapter not deleted');
    }

    return deleted;
  }
}
