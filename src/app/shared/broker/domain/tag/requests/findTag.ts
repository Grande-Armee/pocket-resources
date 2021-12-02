import { Type } from 'class-transformer';
import { IsUUID, ValidateNested } from 'class-validator';

import { TagDto } from './tagDto';

export class FindTagPayloadDto {
  @IsUUID('4')
  public tagId: string;
}

export class FindTagResponseDto {
  @Type(() => TagDto)
  @ValidateNested()
  public tag: TagDto;
}
