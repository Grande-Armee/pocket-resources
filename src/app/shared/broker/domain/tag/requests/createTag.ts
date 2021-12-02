import { Type } from 'class-transformer';
import { IsString, ValidateNested, IsUUID } from 'class-validator';

import { TagDto } from './tagDto';

export class CreateTagPayloadDto {
  @IsString()
  public color: string;

  @IsString()
  public title: string;

  @IsUUID('4')
  public userId: string;
}

export class CreateTagResponseDto {
  @Type(() => TagDto)
  @ValidateNested()
  public tag: TagDto;
}
