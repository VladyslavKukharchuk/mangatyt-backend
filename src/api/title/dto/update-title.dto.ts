import { TitleType } from '@api/title/enum/title-type.enum';
import { TitleStatus } from '@api/title/enum/title-status.enum';
import { TitleTranslateStatus } from '@api/title/enum/title-translate-status.enum';

import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateTitleDto {
  @IsString()
  @IsOptional()
  ukrainianName?: string;

  @IsString()
  @IsOptional()
  englishName?: string;

  @IsString()
  @IsOptional()
  originalName?: string;

  @IsEnum(TitleType)
  @IsOptional()
  type?: TitleType;

  @IsNumber()
  @IsOptional()
  year?: number;

  @IsEnum(TitleStatus)
  @IsOptional()
  status?: TitleStatus;

  @IsEnum(TitleTranslateStatus)
  @IsOptional()
  translateStatus?: TitleTranslateStatus;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  authors?: string[];

  @IsString()
  @IsOptional()
  description?: string;
}
