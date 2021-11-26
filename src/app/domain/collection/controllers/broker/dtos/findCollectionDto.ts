import { Expose, Type } from 'class-transformer';
import { IsUUID, ValidateNested } from 'class-validator';

import { CollectionDto } from './collectionDto';

export class FindCollectionPayloadDto {
  @IsUUID('4')
  @Expose()
  public collectionId: string;
}

export class FindCollectionResponseDto {
  @Expose()
  @Type(() => CollectionDto)
  @ValidateNested()
  public collection: CollectionDto;
}
