import { Expose } from 'class-transformer';

export class CollectionResourceDto {
  @Expose()
  public id: string;

  @Expose()
  public createdAt: Date;

  @Expose()
  public updatedAt: Date;

  @Expose()
  public collectionId: string;

  @Expose()
  public resourceId: string;
}
