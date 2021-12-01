import { Type } from 'class-transformer';
import { IsUUID, ValidateNested } from 'class-validator';

import { UserResourceDto } from './userResourceDto';

export class FindUserResourcePayloadDto {
  @IsUUID('4')
  public userId: string;

  @IsUUID('4')
  public resourceId: string;
}

export class FindUserResourceResponseDto {
  @Type(() => UserResourceDto)
  @ValidateNested()
  public userResource: UserResourceDto;
}
