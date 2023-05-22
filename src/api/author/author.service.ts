import { Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import AuthorRepository from './author.repository';
import { DeleteResult } from 'typeorm';
import { AuthorModel } from './author.model';
import {
  NotFoundException,
  ValidationException,
  ConflictException,
} from '@common/exceptions';
import { S3Service } from '@common/integrations/s3/s3.service';

@Injectable()
export class AuthorService {
  constructor(
    private readonly authorRepository: AuthorRepository,
    private readonly s3Service: S3Service,
  ) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<AuthorModel> {
    const { englishName, ukrainianName, originalName, description } =
      createAuthorDto;

    const newAuthor = new AuthorModel();

    newAuthor.englishName = englishName;
    newAuthor.ukrainianName = ukrainianName;
    newAuthor.originalName = originalName;
    newAuthor.description = description;

    newAuthor.resourceId = this.authorRepository.newResourceId();

    return newAuthor.save();
  }

  async findAll(): Promise<AuthorModel[]> {
    return await this.authorRepository.getMany();
  }

  async findOneByResourceId(resourceId: string): Promise<AuthorModel> {
    const author = await this.authorRepository.getByResourceId(resourceId);

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    return author;
  }

  async update(
    resourceId: string,
    updateAuthorDto: UpdateAuthorDto,
  ): Promise<AuthorModel> {
    const author = await this.findOneByResourceId(resourceId);

    const updatedAuthor = Object.assign(author, updateAuthorDto);

    return await this.authorRepository.saveNewOrUpdatedModel(updatedAuthor);
  }

  async addPhoto(
    resourceId: string,
    file: Express.Multer.File,
  ): Promise<AuthorModel> {
    const author = await this.findOneByResourceId(resourceId);

    if (!file) {
      throw new ValidationException('Request without file');
    }

    file.originalname = `authors/${author.resourceId}/photo`;

    author.photo = await this.s3Service.putOne(file);

    return this.authorRepository.saveNewOrUpdatedModel(author);
  }

  async removePhoto(resourceId: string): Promise<AuthorModel> {
    const author = await this.findOneByResourceId(resourceId);

    const { photo } = author;

    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    await this.s3Service.deleteOne(photo);

    author.photo = null;

    return this.authorRepository.saveNewOrUpdatedModel(author);
  }

  async remove(resourceId: string): Promise<DeleteResult> {
    const author = await this.authorRepository.getWithTitlesByResourceId(
      resourceId,
    );

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const { titles, photo } = author;

    if (photo) {
      await this.s3Service.deleteOne(photo);
    }

    if (titles.length) {
      throw new ConflictException('You cannot delete an author who has titles');
    }

    const deleted = await this.authorRepository.delete(resourceId);

    if (!deleted.affected) {
      throw new NotFoundException('Author not found');
    }

    return deleted;
  }
}
