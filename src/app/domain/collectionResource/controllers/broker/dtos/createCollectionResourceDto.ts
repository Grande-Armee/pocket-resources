import { Expose, Type } from 'class-transformer';
import { IsUUID, ValidateNested } from 'class-validator';

import { CollectionResourceDto } from './collectionResourceDto';

export class CreateCollectionResourcePayloadDto {
  @IsUUID('4')
  @Expose()
  public collectionId: string;

  @IsUUID('4')
  @Expose()
  public resourceId: string;
}

export class CreateCollectionResourceResponseDto {
  @Expose()
  @Type(() => CollectionResourceDto)
  @ValidateNested()
  public collectionResource: CollectionResourceDto;
}
