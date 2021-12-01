import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsInt, IsUUID, ValidateNested } from 'class-validator';

import { ResourceDto } from '@domain/resource/dtos/resourceDto';
import { TagDto } from '@domain/tag/dtos/tagDto';
import { AllowNull } from '@shared/allowNull';

import { UserResourceStatus } from '../entities/types/userResourceStatus';

export class UserResourceDto {
  @IsUUID('4')
  public readonly id: string;

  @IsDate()
  public readonly createdAt: Date;

  @IsDate()
  public readonly updatedAt: Date;

  @IsEnum(UserResourceStatus)
  public readonly status: UserResourceStatus;

  @IsBoolean()
  public readonly isFavorite: boolean;

  @IsInt()
  @AllowNull()
  public readonly rating: number | null;

  @Type(() => ResourceDto)
  @AllowNull()
  @ValidateNested()
  public readonly resource: ResourceDto | null;

  @IsUUID('4')
  public readonly resourceId: string;

  @IsUUID('4')
  public readonly userId: string;

  @Type(() => TagDto)
  @AllowNull()
  @ValidateNested({ each: true })
  public readonly tags: TagDto[] | null;
}
