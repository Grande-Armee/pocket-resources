import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class RemoveTagPayloadDto {
  @IsUUID('4')
  @Expose()
  public tagId: string;
}
