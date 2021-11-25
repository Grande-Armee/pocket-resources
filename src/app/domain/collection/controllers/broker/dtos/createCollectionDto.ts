import { Expose, Type } from 'class-transformer';
import { IsString, IsUUID, ValidateNested } from 'class-validator';

import { CollectionDto } from './collectionDto';

export class CreateCollectionPayloadDto {
  @IsUUID('4')
  @Expose()
  public userId: string;

  @IsString()
  @Expose()
  public title: string;
}

export class CreateCollectionResponseDto {
  @Expose()
  @Type(() => CollectionDto)
  @ValidateNested()
  public collection: CollectionDto;
}
