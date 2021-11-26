import { Expose, Type } from 'class-transformer';
import { IsString, IsOptional, ValidateNested, IsUUID } from 'class-validator';

import { CollectionDto } from './collectionDto';

export class UpdateCollectionPayloadDto {
  @IsUUID('4')
  @Expose()
  public userId: string;

  @IsUUID('4')
  @Expose()
  public collectionId: string;

  @IsOptional()
  @IsString()
  @Expose()
  public title?: string;

  @IsOptional()
  @IsString()
  @Expose()
  public content?: string;

  @IsOptional()
  @IsString()
  @Expose()
  public thumbnailUrl?: string;
}

export class UpdateCollectionResponseDto {
  @Expose()
  @Type(() => CollectionDto)
  @ValidateNested()
  public collection: CollectionDto;
}
