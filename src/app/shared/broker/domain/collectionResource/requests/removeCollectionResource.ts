import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class RemoveCollectionResourcePayloadDto {
  @IsUUID('4')
  @Expose()
  public collectionId: string;

  @IsUUID('4')
  @Expose()
  public resourceId: string;
}
