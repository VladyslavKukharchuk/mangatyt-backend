import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import TeamRepository from '@api/team/team.repository';
import { S3Service } from '@common/integrations/s3/s3.service';
import { TeamModel } from '@api/team/team.model';
import { UserModel } from '@api/user/user.model';
import {
  ConflictException,
  NotFoundException,
  ValidationException,
} from '@common/exceptions';
import { DeleteResult } from 'typeorm';
import { AddMemberDto } from '@api/team/dto/add-member.dto';
import { UserService } from '@api/user/user.service';

@Injectable()
export class TeamService {
  constructor(
    private readonly teamRepository: TeamRepository,
    private readonly userService: UserService,
    private readonly s3Service: S3Service,
  ) {}
  async create(
    createTeamDto: CreateTeamDto,
    member: UserModel,
  ): Promise<TeamModel> {
    const { name, description, website, telegram, discord } = createTeamDto;

    const newTeam = new TeamModel();

    newTeam.name = name;
    newTeam.description = description;
    newTeam.website = website;
    newTeam.telegram = telegram;
    newTeam.discord = discord;
    newTeam.members = [member];

    newTeam.resourceId = this.teamRepository.newResourceId();

    return newTeam.save();
  }

  async findAll(): Promise<TeamModel[]> {
    return await this.teamRepository.getMany();
  }

  async findOneByResourceId(resourceId: string): Promise<TeamModel> {
    const team = await this.teamRepository.getByResourceId(resourceId);

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return team;
  }

  async update(
    resourceId: string,
    updateTeamDto: UpdateTeamDto,
  ): Promise<TeamModel> {
    const team = await this.findOneByResourceId(resourceId);

    const updatedTeam = Object.assign(team, updateTeamDto);

    return await this.teamRepository.saveNewOrUpdatedModel(updatedTeam);
  }

  async addCover(
    resourceId: string,
    file: Express.Multer.File,
  ): Promise<TeamModel> {
    const team = await this.findOneByResourceId(resourceId);

    if (!file) {
      throw new ValidationException('Request without file');
    }

    file.originalname = `teams/${team.resourceId}/cover`;

    team.cover = await this.s3Service.putOne(file);

    return await this.teamRepository.saveNewOrUpdatedModel(team);
  }

  async addMember(
    resourceId: string,
    addMemberDto: AddMemberDto,
  ): Promise<TeamModel> {
    const team = await this.teamRepository.getWithMembersByResourceId(
      resourceId,
    );

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const { member } = addMemberDto;

    const newMember = await this.userService.findByResourceId(member);

    team.members.push(newMember);

    return await this.teamRepository.saveNewOrUpdatedModel(team);
  }

  async removeMember(resourceId: string, memberId: string): Promise<TeamModel> {
    const team = await this.teamRepository.getWithMembersByResourceId(
      resourceId,
    );

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const targetMember = await this.userService.findByResourceId(memberId);

    const index = team.members.findIndex(
      (member) => member.resourceId === targetMember.resourceId,
    );

    if (index === -1) {
      throw new ConflictException('There is no such member in the team');
    }

    team.members.splice(index, 1);

    return await this.teamRepository.saveNewOrUpdatedModel(team);
  }

  async removeCover(resourceId: string): Promise<TeamModel> {
    const team = await this.findOneByResourceId(resourceId);

    const { cover } = team;

    if (!cover) {
      throw new NotFoundException('Cower not found');
    }

    await this.s3Service.deleteOne(cover);

    team.cover = null;

    return await this.teamRepository.saveNewOrUpdatedModel(team);
  }

  async remove(resourceId: string): Promise<DeleteResult> {
    const team = await this.teamRepository.getWithTitlesByResourceId(
      resourceId,
    );

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const { cover, titles } = team;

    if (cover) {
      await this.s3Service.deleteOne(cover);
    }

    if (titles.length) {
      throw new ConflictException(
        'You cannot delete a team that has translated titles',
      );
    }

    const deleted = await this.teamRepository.delete(resourceId);

    if (!deleted.affected) {
      throw new NotFoundException('Team not deleted');
    }

    return deleted;
  }
}
