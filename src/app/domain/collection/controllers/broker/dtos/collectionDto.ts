import { Expose } from 'class-transformer';

import { ResourceDto } from '@shared/broker/domain/resource/requests/resourceDto';

export class CollectionDto {
  @Expose()
  public id: string;

  @Expose()
  public createdAt: Date;

  @Expose()
  public updatedAt: Date;

  @Expose()
  public readonly title: string | null;

  @Expose()
  public readonly thumbnailUrl: string | null;

  @Expose()
  public readonly content: string | null;

  @Expose()
  public readonly userId: string;

  @Expose()
  public readonly resources: ResourceDto[] | null;
}
