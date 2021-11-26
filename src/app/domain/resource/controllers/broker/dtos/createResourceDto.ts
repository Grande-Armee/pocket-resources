import { Expose, Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

import { ResourceDto } from './resourceDto';

export class CreateResourcePayloadDto {
  @IsString()
  @Expose()
  public url: string;
}

export class CreateResourceResponseDto {
  @Expose()
  @Type(() => ResourceDto)
  @ValidateNested()
  public resource: ResourceDto;
}
