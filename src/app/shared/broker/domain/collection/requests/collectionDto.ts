import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';

import { ResourceDto } from '@shared/broker/domain/resource/requests/resourceDto';

export class CollectionDto {
  @IsUUID('4')
  public id: string;

  @IsDate()
  public createdAt: Date;

  @IsDate()
  public updatedAt: Date;

  @IsString()
  @IsOptional()
  public readonly title: string | null;

  @IsString()
  @IsOptional()
  public readonly thumbnailUrl: string | null;

  @IsString()
  @IsOptional()
  public readonly content: string | null;

  @IsUUID('4')
  public readonly userId: string;

  @IsOptional()
  public readonly resources: ResourceDto[] | null;
}
