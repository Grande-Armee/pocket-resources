import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class RemoveUserResourceTagPayloadDto {
  @IsUUID('4')
  @Expose()
  public userId: string;

  @IsUUID('4')
  @Expose()
  public resourceId: string;

  @IsUUID('4')
  @Expose()
  public tagId: string;
}
