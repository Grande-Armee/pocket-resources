import { Expose, Type } from 'class-transformer';
import { IsString, IsOptional, ValidateNested, IsUUID } from 'class-validator';

import { TagDto } from './tagDto';

export class UpdateTagPayloadDto {
  @IsUUID('4')
  @Expose()
  public tagId: string;

  @IsString()
  @IsOptional()
  @Expose()
  public color: string;

  @IsString()
  @IsOptional()
  @Expose()
  public title: string;
}

export class UpdateTagResponseDto {
  @Expose()
  @Type(() => TagDto)
  @ValidateNested()
  public tag: TagDto;
}
