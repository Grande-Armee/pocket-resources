import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

import { ResourceDto } from './resourceDto';

export class CreateResourcePayloadDto {
  @IsString()
  public url: string;
}

export class CreateResourceResponseDto {
  @Type(() => ResourceDto)
  @ValidateNested()
  public resource: ResourceDto;
}
