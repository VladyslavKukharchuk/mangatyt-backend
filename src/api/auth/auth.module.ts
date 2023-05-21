import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import CognitoGateway from '@common/integrations/cognito/cognito.gateway';
import { UserModule } from '@api/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, CognitoGateway],
})
export class AuthModule {}
