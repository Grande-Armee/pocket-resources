import { Expose, Type } from 'class-transformer';
import { IsString, ValidateNested, IsUUID } from 'class-validator';

import { TagDto } from './tagDto';

export class CreateTagPayloadDto {
  @IsString()
  @Expose()
  public color: string;

  @IsString()
  @Expose()
  public title: string;

  @IsUUID('4')
  @Expose()
  public userId: string;
}

export class CreateTagResponseDto {
  @Expose()
  @Type(() => TagDto)
  @ValidateNested()
  public tag: TagDto;
}
