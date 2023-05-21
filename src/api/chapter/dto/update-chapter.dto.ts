import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateChapterDto {
  @IsNumber()
  @IsOptional()
  volume?: number;

  @IsNumber()
  @IsOptional()
  number?: number;

  @IsString()
  @IsOptional()
  ukrainianName?: string;

  @IsString()
  @IsOptional()
  englishName?: string;

  @IsString()
  @IsOptional()
  originalName?: string;
}
