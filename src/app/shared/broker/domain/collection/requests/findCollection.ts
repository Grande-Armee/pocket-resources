import { Type } from 'class-transformer';
import { IsUUID, ValidateNested } from 'class-validator';

import { CollectionDto } from './collectionDto';

export class FindCollectionPayloadDto {
  @IsUUID('4')
  public userId: string;

  @IsUUID('4')
  public collectionId: string;
}

export class FindCollectionResponseDto {
  @Type(() => CollectionDto)
  @ValidateNested()
  public collection: CollectionDto;
}
