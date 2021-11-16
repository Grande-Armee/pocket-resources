import { Expose } from 'class-transformer';

export class TagDto {
  @Expose()
  public readonly id: string;

  @Expose()
  public readonly createdAt: Date;

  @Expose()
  public readonly updatedAt: Date;

  @Expose()
  public readonly color: string;

  @Expose()
  public readonly title: string;

  @Expose()
  public readonly userId: string;
}
