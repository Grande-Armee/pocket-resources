import { ClassConstructor, Expose, plainToClass } from 'class-transformer';

import { ResourceDTO } from '../../resource/dtos/resource.dto';
import { TagDTO } from '../../tag/dtos/tag.dto';
import { UserResourceStatus } from '../entities/user-resource.entity';

// TODO: move to common
function createDTOFactory<T>(type: ClassConstructor<T>) {
  return (params: T): T => {
    return plainToClass(type, params, { excludeExtraneousValues: true });
  };
}

export class UserResourceDTO {
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
  public readonly resource: ResourceDTO | null;

  @Expose()
  public readonly resourceId: string;

  @Expose()
  public readonly userId: string;

  @Expose()
  public readonly tags: TagDTO[] | null;

  public static create = createDTOFactory(UserResourceDTO);
}
