import { Injectable } from '@nestjs/common';
import { CreateTitleDto } from './dto/create-title.dto';
import { UpdateTitleDto } from './dto/update-title.dto';
import TitleRepository from './title.repository';
import { DeleteResult } from 'typeorm';
import { TitleModel } from '@api/title/title.model';
import {
  ConflictException,
  NotFoundException,
  ValidationException,
} from '@common/exceptions';
import { AuthorService } from '@api/author/author.service';
import { AuthorModel } from '@api/author/author.model';
import { S3Service } from '@common/integrations/s3/s3.service';

@Injectable()
export class TitleService {
  constructor(
    private readonly titleRepository: TitleRepository,
    private readonly authorService: AuthorService,
    private readonly s3Service: S3Service,
  ) {}
  async create(createTitleDto: CreateTitleDto): Promise<TitleModel> {
    const {
      ukrainianName,
      englishName,
      originalName,
      type,
      year,
      status,
      translateStatus,
      authors,
      description,
    } = createTitleDto;

    const newTitle = new TitleModel();

    newTitle.ukrainianName = ukrainianName;
    newTitle.englishName = englishName;
    newTitle.originalName = originalName;
    newTitle.type = type;
    newTitle.year = year;
    newTitle.status = status;
    newTitle.translateStatus = translateStatus;
    newTitle.description = description;

    const authorsArr: AuthorModel[] = [];
    for (const resourceId of authors) {
      const author = await this.authorService.findOneByResourceId(resourceId);

      authorsArr.push(author);
    }

    newTitle.authors = authorsArr;

    newTitle.resourceId = this.titleRepository.newResourceId();

    return newTitle.save();
  }

  async findAll(): Promise<TitleModel[]> {
    return await this.titleRepository.getMany();
  }

  async findOneByResourceId(resourceId: string): Promise<TitleModel> {
    const title = await this.titleRepository.getByResourceId(resourceId);

    if (!title) {
      throw new NotFoundException('Title not found');
    }

    return title;
  }

  async update(
    resourceId: string,
    updateTitleDto: UpdateTitleDto,
  ): Promise<TitleModel> {
    const {
      ukrainianName,
      englishName,
      originalName,
      type,
      year,
      status,
      translateStatus,
      authors,
      description,
    } = updateTitleDto;
    const title = await this.findOneByResourceId(resourceId);

    console.log(updateTitleDto);
    console.log(title);

    const authorsArr: AuthorModel[] = [];
    for (const resourceId of authors) {
      const author = await this.authorService.findOneByResourceId(resourceId);

      authorsArr.push(author);
    }

    const updatedTitle = Object.assign(title, {
      ukrainianName,
      englishName,
      originalName,
      type,
      year,
      status,
      translateStatus,
      authorsArr,
      description,
    });

    return await this.titleRepository.saveNewOrUpdatedModel(updatedTitle);
  }

  async addCover(
    resourceId: string,
    file: Express.Multer.File,
  ): Promise<TitleModel> {
    const title = await this.findOneByResourceId(resourceId);

    if (!file) {
      throw new ValidationException('Request without file');
    }

    file.originalname = `titles/${title.resourceId}/cover`;

    title.cover = await this.s3Service.putOne(file);

    return await this.titleRepository.saveNewOrUpdatedModel(title);
  }

  async removeCover(resourceId: string): Promise<TitleModel> {
    const title = await this.findOneByResourceId(resourceId);

    const { cover } = title;

    if (!cover) {
      throw new NotFoundException('Cower not found');
    }

    await this.s3Service.deleteOne(cover);

    title.cover = null;

    return await this.titleRepository.saveNewOrUpdatedModel(title);
  }

  async remove(resourceId: string): Promise<DeleteResult> {
    const title = await this.titleRepository.getWithChaptersByResourceId(
      resourceId,
    );

    if (!title) {
      throw new NotFoundException('Title not found');
    }

    const { chapters, cover } = title;

    if (cover) {
      await this.s3Service.deleteOne(cover);
    }

    if (chapters.length) {
      throw new ConflictException(
        'You cannot delete a title that contains chapters',
      );
    }

    const deleted = await this.titleRepository.delete(resourceId);

    if (!deleted.affected) {
      throw new NotFoundException('Title not found');
    }

    return deleted;
  }
}
