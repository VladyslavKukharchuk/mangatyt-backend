import { Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UserService } from '@api/user/user.service';
import CognitoGateway from '@common/integrations/cognito/cognito.gateway';
import { ConfirmAuthDto } from '@api/auth/dto/confirm-auth.dto';
import { ForgotAuthDto } from '@api/auth/dto/forgot-auth.dto';
import { ConfirmForgotPasswordAuthDto } from '@api/auth/dto/confirm-forgot-password-auth.dto';
import { ChangePasswordAuthDto } from '@api/auth/dto/change-password-auth.dto';
import { ConflictException } from '@common/exceptions';

@Injectable()
export class AuthService {
  constructor(
    private readonly cognitoGateway: CognitoGateway,
    private readonly userService: UserService,
  ) {}
  async register(dto: RegisterAuthDto) {
    const { username, email, password } = dto;

    const oldUser = await this.userService.getByUsername(username);

    if (oldUser) {
      throw new ConflictException('User with this username is already exist');
    }

    const newCognitoUser = await this.cognitoGateway.register(password, email);
    return await this.userService.create(newCognitoUser.UserSub, dto);
  }

  async confirm(dto: ConfirmAuthDto) {
    const { email, code } = dto;
    return await this.cognitoGateway.confirmRegister(email, code);
  }

  async login(dto: LoginAuthDto) {
    const { email, password } = dto;
    return await this.cognitoGateway.login(email, password);
  }

  async forgotPassword(dto: ForgotAuthDto) {
    const { email } = dto;
    return await this.cognitoGateway.forgotPassword(email);
  }

  async confirmForgotPassword(dto: ConfirmForgotPasswordAuthDto) {
    const { confirmationCode, newPassword, email } = dto;
    return await this.cognitoGateway.confirmForgotPassword(
      confirmationCode,
      newPassword,
      email,
    );
  }

  async changePassword(accessToken: string, dto: ChangePasswordAuthDto) {
    const { oldPassword, newPassword } = dto;
    return await this.cognitoGateway.changePassword(
      accessToken,
      oldPassword,
      newPassword,
    );
  }
}
