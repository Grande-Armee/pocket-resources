import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class RemoveResourcePayloadDto {
  @IsUUID('4')
  @Expose()
  public resourceId: string;
}
