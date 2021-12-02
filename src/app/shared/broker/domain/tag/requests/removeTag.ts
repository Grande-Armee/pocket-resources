import { IsUUID } from 'class-validator';

export class RemoveTagPayloadDto {
  @IsUUID('4')
  public tagId: string;
}
