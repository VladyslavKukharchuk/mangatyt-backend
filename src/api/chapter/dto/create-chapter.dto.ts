import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateChapterDto {
  @IsNumber()
  volume: number;

  @IsNumber()
  number: number;

  @IsString()
  @IsOptional()
  ukrainianName?: string;

  @IsString()
  @IsOptional()
  englishName?: string;

  @IsString()
  @IsOptional()
  originalName?: string;

  @IsString()
  title: string;

  @IsString()
  translator: string;
}
