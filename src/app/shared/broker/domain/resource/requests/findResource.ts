import { Type } from 'class-transformer';
import { IsUUID, ValidateNested } from 'class-validator';

import { ResourceDto } from './resourceDto';

export class FindResourcePayloadDto {
  @IsUUID('4')
  public resourceId: string;
}

export class FindResourceResponseDto {
  @Type(() => ResourceDto)
  @ValidateNested()
  public resource: ResourceDto;
}
