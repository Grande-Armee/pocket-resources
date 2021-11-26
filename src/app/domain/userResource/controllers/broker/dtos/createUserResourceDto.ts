import { Expose, Type } from 'class-transformer';
import { IsUUID, ValidateNested } from 'class-validator';

import { UserResourceDto } from './userResourceDto';

export class CreateUserResourcePayloadDto {
  @IsUUID('4')
  @Expose()
  public userId: string;

  @IsUUID('4')
  @Expose()
  public resourceId: string;
}

export class CreateUserResourceResponseDto {
  @Expose()
  @Type(() => UserResourceDto)
  @ValidateNested()
  public userResource: UserResourceDto;
}
