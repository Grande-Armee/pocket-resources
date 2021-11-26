import { Expose } from 'class-transformer';

import { ResourceDto } from '@domain/resource/controllers/broker/dtos/resourceDto';
import { TagDto } from '@domain/tag/controllers/broker/dtos/tagDto';

import { UserResourceStatus } from '../../../entities/types/userResourceStatus';

export class UserResourceDto {
  @Expose()
  public readonly id: string;

  @Expose()
  public readonly createdAt: Date;

  @Expose()
  public readonly updatedAt: Date;

  @Expose()
  public readonly status: UserResourceStatus;

  @Expose()
  public readonly isFavorite: boolean;

  @Expose()
  public readonly rating: number | null;

  @Expose()
  public readonly resource: ResourceDto | null;

  @Expose()
  public readonly resourceId: string;

  @Expose()
  public readonly userId: string;

  @Expose()
  public readonly tags: TagDto[] | null;
}
