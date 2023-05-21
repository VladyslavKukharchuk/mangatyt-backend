import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotAuthDto {
  @IsEmail()
  @ApiProperty()
  email: string;
}
