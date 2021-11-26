import { Expose } from 'class-transformer';

export class UserResourceTagDto {
  @Expose()
  public id: string;

  @Expose()
  public createdAt: Date;

  @Expose()
  public updatedAt: Date;

  @Expose()
  public userId: string;

  @Expose()
  public resourceId: string;

  @Expose()
  public tagId: string;
}
