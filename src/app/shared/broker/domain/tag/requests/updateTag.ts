import { Type } from 'class-transformer';
import { IsString, IsOptional, ValidateNested, IsUUID } from 'class-validator';

import { TagDto } from './tagDto';

export class UpdateTagPayloadDto {
  @IsUUID('4')
  public tagId: string;

  @IsString()
  @IsOptional()
  public color: string;

  @IsString()
  @IsOptional()
  public title: string;
}

export class UpdateTagResponseDto {
  @Type(() => TagDto)
  @ValidateNested()
  public tag: TagDto;
}
