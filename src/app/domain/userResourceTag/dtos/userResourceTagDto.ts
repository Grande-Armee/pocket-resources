import { IsDate, IsUUID } from 'class-validator';

export class UserResourceTagDto {
  @IsUUID('4')
  public readonly id: string;

  @IsDate()
  public readonly createdAt: Date;

  @IsDate()
  public readonly updatedAt: Date;

  @IsUUID('4')
  public readonly userResourceId: string;

  @IsUUID('4')
  public readonly tagId: string;
}
