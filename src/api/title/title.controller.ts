import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TitleService } from './title.service';
import { CreateTitleDto } from './dto/create-title.dto';
import { UpdateTitleDto } from './dto/update-title.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('title')
export class TitleController {
  constructor(private readonly titleService: TitleService) {}

  @Post()
  create(@Body() createTitleDto: CreateTitleDto) {
    return this.titleService.create(createTitleDto);
  }

  @Get(':resourceId')
  findOne(@Param('resourceId') resourceId: string) {
    return this.titleService.findOneByResourceId(resourceId);
  }

  @Get()
  findAll() {
    return this.titleService.findAll();
  }

  @Put(':resourceId')
  update(
    @Param('resourceId') resourceId: string,
    @Body() updateTitleDto: UpdateTitleDto,
  ) {
    return this.titleService.update(resourceId, updateTitleDto);
  }

  @Post(':resourceId/cover')
  @UseInterceptors(FileInterceptor('image'))
  addCover(
    @Param('resourceId') resourceId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.titleService.addCover(resourceId, file);
  }

  @Delete(':resourceId/cover')
  removeCover(@Param('resourceId') resourceId: string) {
    return this.titleService.removeCover(resourceId);
  }

  @Delete(':resourceId')
  remove(@Param('resourceId') resourceId: string) {
    return this.titleService.remove(resourceId);
  }
}
