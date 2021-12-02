import { Type } from 'class-transformer';
import { IsString, IsOptional, ValidateNested, IsUUID } from 'class-validator';

import { ResourceDto } from './resourceDto';

export class UpdateResourcePayloadDto {
  @IsUUID('4')
  public resourceId: string;

  @IsOptional()
  @IsString()
  public title?: string;

  @IsOptional()
  @IsString()
  public content?: string;

  @IsOptional()
  @IsString()
  public thumbnailUrl?: string;
}

export class UpdateResourceResponseDto {
  @Type(() => ResourceDto)
  @ValidateNested()
  public resource: ResourceDto;
}
