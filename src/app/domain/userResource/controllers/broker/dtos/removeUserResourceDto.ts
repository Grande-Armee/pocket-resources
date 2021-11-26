import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class RemoveUserResourcePayloadDto {
  @IsUUID('4')
  @Expose()
  public userId: string;

  @IsUUID('4')
  @Expose()
  public resourceId: string;
}
