import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@common/decorators/user.decorator';
import { UserModel } from '@api/user/user.model';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  create(@User() user: UserModel, @Body() createTeamDto: CreateTeamDto) {
    return this.teamService.create(createTeamDto, user);
  }

  @Get(':resourceId')
  findOne(@Param('resourceId') resourceId: string) {
    return this.teamService.findOneByResourceId(resourceId);
  }

  @Get()
  findAll() {
    return this.teamService.findAll();
  }

  @Put(':resourceId')
  update(
    @Param('resourceId') resourceId: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamService.update(resourceId, updateTeamDto);
  }

  @Post(':resourceId/cover')
  @UseInterceptors(FileInterceptor('image'))
  addCover(
    @Param('resourceId') resourceId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.teamService.addCover(resourceId, file);
  }

  @Delete(':resourceId/cover')
  removeCover(@Param('resourceId') resourceId: string) {
    return this.teamService.removeCover(resourceId);
  }

  @Delete(':resourceId')
  remove(@Param('resourceId') resourceId: string) {
    return this.teamService.remove(resourceId);
  }
}
