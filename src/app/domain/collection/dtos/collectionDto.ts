import { Expose } from 'class-transformer';

// import { ResourceDto } from '@domain/resource/dtos/resourceDto';

export class CollectionDto {
  @Expose()
  public readonly id: string;

  @Expose()
  public readonly createdAt: Date;

  @Expose()
  public readonly updatedAt: Date;

  @Expose()
  public readonly title: string | null;

  @Expose()
  public readonly thumbnailUrl: string | null;

  @Expose()
  public readonly content: string | null;

  @Expose()
  public readonly userId: string;

  // @Expose()
  // public readonly resources: ResourceDto[] | null;
}
