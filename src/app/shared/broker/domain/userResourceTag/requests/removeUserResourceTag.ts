import { IsUUID } from 'class-validator';

export class RemoveUserResourceTagPayloadDto {
  @IsUUID('4')
  public userId: string;

  @IsUUID('4')
  public resourceId: string;

  @IsUUID('4')
  public tagId: string;
}
