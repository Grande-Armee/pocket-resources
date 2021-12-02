import { IsDate, IsUUID } from 'class-validator';

export class UserResourceTagDto {
  @IsUUID('4')
  public id: string;

  @IsDate()
  public createdAt: Date;

  @IsDate()
  public updatedAt: Date;

  @IsUUID('4')
  public userId: string;

  @IsUUID('4')
  public resourceId: string;

  @IsUUID('4')
  public tagId: string;
}
