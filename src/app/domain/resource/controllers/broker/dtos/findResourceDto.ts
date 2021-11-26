import { Expose, Type } from 'class-transformer';
import { IsUUID, ValidateNested } from 'class-validator';

import { ResourceDto } from './resourceDto';

export class FindResourcePayloadDto {
  @IsUUID('4')
  @Expose()
  public resourceId: string;
}

export class FindResourceResponseDto {
  @Expose()
  @Type(() => ResourceDto)
  @ValidateNested()
  public resource: ResourceDto;
}
