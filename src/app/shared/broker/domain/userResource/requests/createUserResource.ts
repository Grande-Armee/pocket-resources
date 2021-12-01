import { Type } from 'class-transformer';
import { IsUUID, ValidateNested } from 'class-validator';

import { UserResourceDto } from './userResourceDto';

export class CreateUserResourcePayloadDto {
  @IsUUID('4')
  public userId: string;

  @IsUUID('4')
  public resourceId: string;
}

export class CreateUserResourceResponseDto {
  @Type(() => UserResourceDto)
  @ValidateNested()
  public userResource: UserResourceDto;
}
