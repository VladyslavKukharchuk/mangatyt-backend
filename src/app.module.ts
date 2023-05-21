import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TitleModule } from '@api/title/title.module';
import { CommentModule } from '@api/comment/comment.module';
import { ChapterModule } from '@api/chapter/chapter.module';
import { AuthorModule } from '@api/author/author.module';
import { UserModule } from '@api/user/user.module';
import { AuthModule } from '@api/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@database/database.module';
import { PassportModule } from '@nestjs/passport';
import { S3Module } from '@common/integrations/s3/s3.module';
import { JwtStrategy } from '@common/integrations/cognito/jwt.strategy';

@Module({
  controllers: [AppController],
  providers: [JwtStrategy],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    UserModule,
    AuthorModule,
    ChapterModule,
    CommentModule,
    TitleModule,
    DatabaseModule,
    S3Module,
  ],
})
export class AppModule {}
