import { Expose, Type } from 'class-transformer';
import { IsOptional, ValidateNested, IsBoolean, IsNumber, IsUUID } from 'class-validator';

import { UserResourceStatus } from '../../../entities/types/userResourceStatus';
import { UserResourceDto } from './userResourceDto';

export class UpdateUserResourcePayloadDto {
  @IsUUID('4')
  @Expose()
  public userId: string;

  @IsUUID('4')
  @Expose()
  public resourceId: string;

  @Expose()
  @IsOptional()
  public status?: UserResourceStatus;

  @IsBoolean()
  @IsOptional()
  @Expose()
  public isFavorite?: boolean;

  @IsOptional()
  @IsNumber()
  @Expose()
  public rating?: number;
}

export class UpdateUserResourceResponseDto {
  @Expose()
  @Type(() => UserResourceDto)
  @ValidateNested()
  public userResource: UserResourceDto;
}
