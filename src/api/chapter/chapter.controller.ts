import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('chapter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Post()
  create(@Body() createChapterDto: CreateChapterDto) {
    return this.chapterService.create(createChapterDto);
  }

  @Get(':resourceId')
  findOne(@Param('resourceId') resourceId: string) {
    return this.chapterService.findOneByResourceId(resourceId);
  }

  @Get()
  findAll() {
    return this.chapterService.findAll();
  }

  @Put(':resourceId')
  update(
    @Param('resourceId') resourceId: string,
    @Body() updateChapterDto: UpdateChapterDto,
  ) {
    return this.chapterService.update(resourceId, updateChapterDto);
  }

  @Post(':resourceId/pages')
  @UseInterceptors(FilesInterceptor('images'))
  addPages(
    @Param('resourceId') resourceId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.chapterService.addPages(resourceId, files);
  }

  @Delete(':resourceId')
  remove(@Param('resourceId') resourceId: string) {
    return this.chapterService.remove(resourceId);
  }

  @Delete(':resourceId/pages')
  removePages(@Param('resourceId') resourceId: string) {
    return this.chapterService.removePages(resourceId);
  }
}
