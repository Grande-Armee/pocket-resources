import { Expose } from 'class-transformer';

export class CollectionResourceDto {
  @Expose()
  public readonly id: string;

  @Expose()
  public readonly createdAt: Date;

  @Expose()
  public readonly updatedAt: Date;

  @Expose()
  public readonly collectionId: string;

  @Expose()
  public readonly resourceId: string;
}
