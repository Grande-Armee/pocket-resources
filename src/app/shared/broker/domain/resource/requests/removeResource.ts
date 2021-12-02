import { IsUUID } from 'class-validator';

export class RemoveResourcePayloadDto {
  @IsUUID('4')
  public resourceId: string;
}
