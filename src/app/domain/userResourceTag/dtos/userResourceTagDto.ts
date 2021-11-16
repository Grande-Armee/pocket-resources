import { Expose } from 'class-transformer';

export class UserResourceTagDto {
  @Expose()
  public readonly id: string;

  @Expose()
  public readonly createdAt: Date;

  @Expose()
  public readonly updatedAt: Date;

  @Expose()
  public readonly userResourceId: string;

  @Expose()
  public readonly tagId: string;
}
