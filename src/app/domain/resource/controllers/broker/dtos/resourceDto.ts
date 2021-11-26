import { Expose } from 'class-transformer';

export class ResourceDto {
  @Expose()
  public readonly id: string;

  @Expose()
  public readonly createdAt: Date;

  @Expose()
  public readonly updatedAt: Date;

  @Expose()
  public readonly url: string | null;

  @Expose()
  public readonly title: string | null;

  @Expose()
  public readonly thumbnailUrl: string | null;

  @Expose()
  public readonly content: string | null;
}
