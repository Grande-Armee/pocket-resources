import { IsBoolean, IsDate, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

import { UserResourceStatus } from '@domain/userResource/entities/types/userResourceStatus';
import { ResourceDto } from '@shared/broker/domain/resource/requests/resourceDto';
import { TagDto } from '@shared/broker/domain/tag/requests/tagDto';

export class UserResourceDto {
  @IsUUID('4')
  public readonly id: string;

  @IsDate()
  public readonly createdAt: Date;

  @IsDate()
  public readonly updatedAt: Date;

  public readonly status: UserResourceStatus;

  @IsBoolean()
  public readonly isFavorite: boolean;

  @IsNumber()
  @IsOptional()
  public readonly rating: number | null;

  @IsOptional()
  public readonly resource: ResourceDto | null;

  @IsString()
  public readonly resourceId: string;

  @IsString()
  public readonly userId: string;

  @IsOptional()
  public readonly tags: TagDto[] | null;
}
