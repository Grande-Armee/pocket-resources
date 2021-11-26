import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class RemoveCollectionPayloadDto {
  @IsUUID('4')
  @Expose()
  public collectionId: string;
}
