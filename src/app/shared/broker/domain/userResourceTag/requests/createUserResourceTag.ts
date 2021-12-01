import { Type } from 'class-transformer';
import { IsUUID, ValidateNested } from 'class-validator';

import { UserResourceTagDto } from './userResourceTagDto';

export class CreateUserResourceTagPayloadDto {
  @IsUUID('4')
  public userId: string;

  @IsUUID('4')
  public resourceId: string;

  @IsUUID('4')
  public tagId: string;
}

export class CreateUserResourceTagResponseDto {
  @Type(() => UserResourceTagDto)
  @ValidateNested()
  public userResourceTag: UserResourceTagDto;
}
