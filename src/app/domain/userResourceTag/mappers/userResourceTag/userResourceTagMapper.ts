import { Mapper } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';

import { UserResourceTagDto } from '../../dtos/userResourceTagDto';
import { UserResourceTag } from '../../entities/userResourceTag';

@Injectable()
export class UserResourceTagMapper implements Mapper<UserResourceTag, UserResourceTagDto> {
  public mapEntityToDto(entity: UserResourceTag): UserResourceTagDto {
    const { id, createdAt, updatedAt, userResourceId, tagId } = entity;

    return UserResourceTagDto.create({
      id,
      createdAt,
      updatedAt,
      userResourceId,
      tagId,
    });
  }
}
