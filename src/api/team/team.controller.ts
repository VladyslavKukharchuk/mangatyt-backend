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
import { AddMemberDto } from '@api/team/dto/add-member.dto';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @UseGuards(AuthGuard('jwt'))
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

  @UseGuards(AuthGuard('jwt'))
  @Put(':resourceId')
  update(
    @Param('resourceId') resourceId: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamService.update(resourceId, updateTeamDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':resourceId/cover')
  @UseInterceptors(FileInterceptor('image'))
  addCover(
    @Param('resourceId') resourceId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.teamService.addCover(resourceId, file);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':resourceId/members')
  addMember(
    @Param('resourceId') resourceId: string,
    @Body() addMemberDto: AddMemberDto,
  ) {
    return this.teamService.addMember(resourceId, addMemberDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':resourceId/members/:member')
  removeMember(
    @Param('resourceId') resourceId: string,
    @Param('member') member: string,
  ) {
    return this.teamService.removeMember(resourceId, member);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':resourceId/cover')
  removeCover(@Param('resourceId') resourceId: string) {
    return this.teamService.removeCover(resourceId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':resourceId')
  remove(@Param('resourceId') resourceId: string) {
    return this.teamService.remove(resourceId);
  }
}
