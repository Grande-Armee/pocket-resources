import { Expose, Type } from 'class-transformer';
import { IsString, IsOptional, ValidateNested, IsUUID } from 'class-validator';

import { ResourceDto } from './resourceDto';

export class UpdateResourcePayloadDto {
  @IsUUID('4')
  @Expose()
  public resourceId: string;

  @IsOptional()
  @IsString()
  @Expose()
  public title?: string;

  @IsOptional()
  @IsString()
  @Expose()
  public content?: string;

  @IsOptional()
  @IsString()
  @Expose()
  public thumbnailUrl?: string;
}

export class UpdateResourceResponseDto {
  @Expose()
  @Type(() => ResourceDto)
  @ValidateNested()
  public resource: ResourceDto;
}
