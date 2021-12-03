import { AllowNull } from '@grande-armee/pocket-common';
import { IsDate, IsString, IsUUID } from 'class-validator';

export class ResourceDto {
  @IsUUID('4')
  public readonly id: string;

  @IsDate()
  public readonly createdAt: Date;

  @IsDate()
  public readonly updatedAt: Date;

  @IsString()
  public readonly url: string;

  @AllowNull()
  @IsString()
  public readonly title: string | null;

  @AllowNull()
  @IsString()
  public readonly thumbnailUrl: string | null;

  @AllowNull()
  @IsString()
  public readonly content: string | null;
}
