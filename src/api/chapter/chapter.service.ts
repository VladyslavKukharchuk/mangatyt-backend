import { Injectable } from '@nestjs/common';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import ChapterRepository from './chapter.repository';
import { TitleService } from '@api/title/title.service';
import { ChapterModel } from '@api/chapter/chapter.model';
import { NotFoundException } from '@common/exceptions';
import { DeleteResult } from 'typeorm';
import { S3Service } from '@common/integrations/s3/s3.service';
import { ConflictException, ValidationException } from '@common/exceptions';
import { TeamService } from '@api/team/team.service';

@Injectable()
export class ChapterService {
  constructor(
    private readonly chapterRepository: ChapterRepository,
    private readonly titleService: TitleService,
    private readonly teamService: TeamService,
    private readonly s3Service: S3Service,
  ) {}

  async create(createChapterDto: CreateChapterDto) {
    const {
      volume,
      number,
      ukrainianName,
      englishName,
      originalName,
      title,
      translator,
    } = createChapterDto;

    const associatedTitle = await this.titleService.findOneByResourceId(title);

    const team = await this.teamService.findOneByResourceId(translator);

    const newChapter = new ChapterModel();

    newChapter.title = associatedTitle;
    newChapter.translator = team;

    newChapter.volume = volume;
    newChapter.number = number;
    newChapter.ukrainianName = ukrainianName;
    newChapter.englishName = englishName;
    newChapter.originalName = originalName;

    newChapter.resourceId = this.chapterRepository.newResourceId();

    await this.titleService.addTranslator(
      associatedTitle.resourceId,
      translator,
    );

    return newChapter.save();
  }

  async findAll(): Promise<ChapterModel[]> {
    return await this.chapterRepository.getMany();
  }

  async findOneByResourceId(resourceId: string): Promise<ChapterModel> {
    const chapter = await this.chapterRepository.getByResourceId(resourceId);

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    return chapter;
  }

  async update(
    resourceId: string,
    updateChapterDto: UpdateChapterDto,
  ): Promise<ChapterModel> {
    const chapter = await this.findOneByResourceId(resourceId);

    const updatedChapter = Object.assign(chapter, updateChapterDto);

    return await this.chapterRepository.saveNewOrUpdatedModel(updatedChapter);
  }

  async addPages(
    resourceId: string,
    files: Express.Multer.File[],
  ): Promise<ChapterModel> {
    const chapter = await this.findOneByResourceId(resourceId);

    const { volume, number, title, pages, translator } = chapter;

    if (pages.length) {
      throw new ConflictException(
        'Pages have already been added to this chapter',
      );
    }

    if (!files.length) {
      throw new ValidationException('Request without files');
    }

    const updatedFiles = files.map((file, index) => ({
      ...file,
      originalname: `titles/${title.resourceId}/chapters/${
        translator.resourceId
      }/${volume}/${number}/${index + 1}`,
    }));

    chapter.pages = await this.s3Service.putMany(updatedFiles);

    return await this.chapterRepository.saveNewOrUpdatedModel(chapter);
  }

  async removePages(resourceId: string): Promise<ChapterModel> {
    const chapter = await this.findOneByResourceId(resourceId);

    const { pages } = chapter;

    if (!pages.length) {
      throw new NotFoundException('Pages not found');
    }

    await this.s3Service.deleteMany(pages);

    chapter.pages = [];

    return await this.chapterRepository.saveNewOrUpdatedModel(chapter);
  }

  async remove(resourceId: string): Promise<DeleteResult> {
    await this.removePages(resourceId);

    const deleted = await this.chapterRepository.delete(resourceId);

    if (!deleted.affected) {
      throw new NotFoundException('Chapter not deleted');
    }

    return deleted;
  }
}
