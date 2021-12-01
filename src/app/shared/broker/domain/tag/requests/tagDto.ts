import { IsDate, IsString, IsUUID } from 'class-validator';

export class TagDto {
  @IsString()
  public readonly id: string;

  @IsDate()
  public readonly createdAt: Date;

  @IsDate()
  public readonly updatedAt: Date;

  @IsString()
  public readonly color: string;

  @IsString()
  public readonly title: string;

  @IsUUID('4')
  public readonly userId: string;
}
