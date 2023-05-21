import { IsOptional, IsString } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  englishName: string;

  @IsString()
  @IsOptional()
  ukrainianName?: string;

  @IsString()
  @IsOptional()
  originalName?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
