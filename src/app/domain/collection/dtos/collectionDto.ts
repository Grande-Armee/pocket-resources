import { Type } from 'class-transformer';
import { IsDate, IsString, IsUUID, ValidateNested } from 'class-validator';

import { ResourceDto } from '@domain/resource/dtos/resourceDto';
import { AllowNull } from '@shared/allowNull';

export class CollectionDto {
  @IsUUID('4')
  public readonly id: string;

  @IsDate()
  public readonly createdAt: Date;

  @IsDate()
  public readonly updatedAt: Date;

  @IsString()
  @AllowNull()
  public readonly title: string | null;

  @IsString()
  @AllowNull()
  public readonly thumbnailUrl: string | null;

  @IsString()
  @AllowNull()
  public readonly content: string | null;

  @IsUUID('4')
  public readonly userId: string;

  @Type(() => ResourceDto)
  @AllowNull()
  @ValidateNested({ each: true })
  public readonly resources: ResourceDto[] | null;
}
