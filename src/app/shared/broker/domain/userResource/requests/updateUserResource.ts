import { Type } from 'class-transformer';
import { IsOptional, ValidateNested, IsBoolean, IsNumber, IsUUID } from 'class-validator';

import { UserResourceStatus } from '@domain/userResource/entities/types/userResourceStatus';

import { UserResourceDto } from './userResourceDto';

export class UpdateUserResourcePayloadDto {
  @IsUUID('4')
  public userId: string;

  @IsUUID('4')
  public resourceId: string;

  @IsOptional()
  public status?: UserResourceStatus;

  @IsBoolean()
  @IsOptional()
  public isFavorite?: boolean;

  @IsOptional()
  @IsNumber()
  public rating?: number;
}

export class UpdateUserResourceResponseDto {
  @Type(() => UserResourceDto)
  @ValidateNested()
  public userResource: UserResourceDto;
}
