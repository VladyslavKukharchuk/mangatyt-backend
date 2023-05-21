import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ConfirmAuthDto } from './dto/confirm-auth.dto';
import { ForgotAuthDto } from './dto/forgot-auth.dto';
import { ConfirmForgotPasswordAuthDto } from './dto/confirm-forgot-password-auth.dto';
import { ChangePasswordAuthDto } from './dto/change-password-auth.dto';
import { AccessToken } from '@common/decorators/access-token.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() dto: RegisterAuthDto) {
    return this.authService.register(dto);
  }

  @Post('confirm')
  confirm(@Body() dto: ConfirmAuthDto) {
    return this.authService.confirm(dto);
  }

  @Post('login')
  findAll(@Body() dto: LoginAuthDto) {
    return this.authService.login(dto);
  }

  @Post('forgot')
  forgotPassword(@Body() dto: ForgotAuthDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('confirm-password')
  confirmForgotPassword(@Body() dto: ConfirmForgotPasswordAuthDto) {
    return this.authService.confirmForgotPassword(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('change-password')
  changePassword(
    @Body() dto: ChangePasswordAuthDto,
    @AccessToken() token: string,
  ) {
    return this.authService.changePassword(token, dto);
  }
}
