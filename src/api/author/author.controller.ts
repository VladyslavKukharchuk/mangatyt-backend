import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put, UseInterceptors, UploadedFile
} from "@nestjs/common";
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto);
  }

  @Get(':resourceId')
  findOne(@Param('resourceId') resourceId: string) {
    return this.authorService.findOneByResourceId(resourceId);
  }

  @Get()
  findAll() {
    return this.authorService.findAll();
  }

  @Put(':resourceId')
  update(
    @Param('resourceId') resourceId: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    return this.authorService.update(resourceId, updateAuthorDto);
  }

  @Post(':resourceId/photo')
  @UseInterceptors(FileInterceptor('image'))
  addPhoto(
    @Param('resourceId') resourceId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.authorService.addPhoto(resourceId, file);
  }

  @Delete(':resourceId/photo')
  removePhoto(@Param('resourceId') resourceId: string) {
    return this.authorService.removePhoto(resourceId);
  }

  @Delete(':resourceId')
  remove(@Param('resourceId') resourceId: string) {
    return this.authorService.remove(resourceId);
  }
}
