import {
  Controller,
  Get,
  Body,
  Param,
  UseGuards,
  Put,
  UseInterceptors,
  UploadedFile,
  Post,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import JwtAuthGuard from '@common/integrations/cognito/jwt.guard';
import { User } from '@common/decorators/user.decorator';
import { UserModel } from './user.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessToken } from '@common/decorators/access-token.decorator';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':resourceId')
  findOne(@Param('resourceId') resourceId: string) {
    return this.userService.findByResourceId(resourceId);
  }

  @Put()
  update(@User() user: UserModel, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(user, updateUserDto);
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('image'))
  addAvatar(
    @User() user: UserModel,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.addAvatar(user, file);
  }

  @Delete('avatar')
  removeAvatar(@User() user: UserModel) {
    return this.userService.removeAvatar(user);
  }

  @Delete()
  remove(@AccessToken() token: string, @User() user: UserModel) {
    return this.userService.remove(token, user);
  }
}
