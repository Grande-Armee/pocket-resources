import { AllowNull, Transformer, UserResourceStatus } from '@grande-armee/pocket-common';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsInt, IsUUID, ValidateNested } from 'class-validator';

import { ResourceDto } from '@domain/resource/dtos/resourceDto';
import { TagDto } from '@domain/tag/dtos/tagDto';

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

  @AllowNull()
  @IsInt()
  public readonly rating: number | null;

  @AllowNull()
  @Type(() => ResourceDto)
  @ValidateNested()
  public readonly resource: ResourceDto | null;

  @IsUUID('4')
  public readonly resourceId: string;

  @IsUUID('4')
  public readonly userId: string;

  @AllowNull()
  @Type(() => TagDto)
  @ValidateNested({ each: true })
  public readonly tags: TagDto[] | null;

  public static readonly create = Transformer.createInstanceFactory(UserResourceDto);
}
