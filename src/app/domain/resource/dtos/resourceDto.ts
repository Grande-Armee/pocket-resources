import { IsDate, IsString, IsUUID } from 'class-validator';

import { AllowNull } from '@shared/allowNull';

export class ResourceDto {
  @IsUUID('4')
  public readonly id: string;

  @IsDate()
  public readonly createdAt: Date;

  @IsDate()
  public readonly updatedAt: Date;

  @IsString()
  public readonly url: string;

  @IsString()
  @AllowNull()
  public readonly title: string | null;

  @IsString()
  @AllowNull()
  public readonly thumbnailUrl: string | null;

  @IsString()
  @AllowNull()
  public readonly content: string | null;
}
