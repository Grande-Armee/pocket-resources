import { Type } from 'class-transformer';
import { IsString, IsOptional, ValidateNested, IsUUID } from 'class-validator';

import { CollectionDto } from './collectionDto';

export class UpdateCollectionPayloadDto {
  @IsUUID('4')
  public userId: string;

  @IsUUID('4')
  public collectionId: string;

  @IsOptional()
  @IsString()
  public title?: string;

  @IsOptional()
  @IsString()
  public content?: string;

  @IsOptional()
  @IsString()
  public thumbnailUrl?: string;
}

export class UpdateCollectionResponseDto {
  @Type(() => CollectionDto)
  @ValidateNested()
  public collection: CollectionDto;
}
