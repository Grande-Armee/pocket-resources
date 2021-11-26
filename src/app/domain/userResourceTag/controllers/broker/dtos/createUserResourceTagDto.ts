import { Expose, Type } from 'class-transformer';
import { IsUUID, ValidateNested } from 'class-validator';

import { UserResourceTagDto } from './userResourceTagDto';

export class CreateUserResourceTagPayloadDto {
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

export class CreateUserResourceTagResponseDto {
  @Expose()
  @Type(() => UserResourceTagDto)
  @ValidateNested()
  public userResourceTag: UserResourceTagDto;
}
