import { TitleType } from '@api/title/enum/title-type.enum';
import { TitleStatus } from '@api/title/enum/title-status.enum';
import { TitleTranslateStatus } from '@api/title/enum/title-translate-status.enum';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTitleDto {
  @IsString()
  ukrainianName: string;

  @IsString()
  englishName: string;

  @IsString()
  @IsOptional()
  originalName?: string;

  @IsEnum(TitleType)
  type: TitleType;

  @IsNumber()
  year: number;

  @IsEnum(TitleStatus)
  status: TitleStatus;

  @IsEnum(TitleTranslateStatus)
  translateStatus: TitleTranslateStatus;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  authors: string[];

  @IsString()
  description: string;

  @IsString()
  translator: string;
}
