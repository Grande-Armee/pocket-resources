import { Expose, Type } from 'class-transformer';
import { IsUUID, ValidateNested } from 'class-validator';

import { TagDto } from './tagDto';

export class FindTagPayloadDto {
  @IsUUID('4')
  @Expose()
  public tagId: string;
}

export class FindTagResponseDto {
  @Expose()
  @Type(() => TagDto)
  @ValidateNested()
  public tag: TagDto;
}
