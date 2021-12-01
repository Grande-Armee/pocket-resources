import { IsUUID } from 'class-validator';

export class RemoveCollectionPayloadDto {
  @IsUUID('4')
  public userId: string;

  @IsUUID('4')
  public collectionId: string;
}
