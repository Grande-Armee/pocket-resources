import { Transformer } from '@grande-armee/pocket-common';
import { IsUUID, IsDate } from 'class-validator';

export class CollectionResourceDto {
  @IsUUID('4')
  public readonly id: string;

  @IsDate()
  public readonly createdAt: Date;

  @IsDate()
  public readonly updatedAt: Date;

  @IsUUID('4')
  public readonly collectionId: string;

  @IsUUID('4')
  public readonly resourceId: string;

  public static readonly create = Transformer.createInstanceFactory(CollectionResourceDto);
}
