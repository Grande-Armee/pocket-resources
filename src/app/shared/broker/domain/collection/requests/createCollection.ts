import { Type } from 'class-transformer';
import { IsString, IsUUID, ValidateNested } from 'class-validator';

import { CollectionDto } from './collectionDto';

export class CreateCollectionPayloadDto {
  @IsUUID('4')
  public userId: string;

  @IsString()
  public title: string;
}

export class CreateCollectionResponseDto {
  @Type(() => CollectionDto)
  @ValidateNested()
  public collection: CollectionDto;
}
