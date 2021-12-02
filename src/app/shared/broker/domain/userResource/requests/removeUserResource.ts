import { IsUUID } from 'class-validator';

export class RemoveUserResourcePayloadDto {
  @IsUUID('4')
  public userId: string;

  @IsUUID('4')
  public resourceId: string;
}
