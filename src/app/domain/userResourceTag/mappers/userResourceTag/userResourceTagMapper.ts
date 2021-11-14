import { Injectable } from '@nestjs/common';

import { Mapper } from '../../../../shared/mapper/mapper';
import { UserResourceTagDTO } from '../../dtos/userResourceTagDTO';
import { UserResourceTag } from '../../entities/userResourceTag';

@Injectable()
export class UserResourceTagMapper implements Mapper<UserResourceTag, UserResourceTagDTO> {
  public mapEntityToDTO(entity: UserResourceTag): UserResourceTagDTO {
    const { id, createdAt, updatedAt, userResourceId, tagId } = entity;

    return UserResourceTagDTO.create({
      id,
      createdAt,
      updatedAt,
      userResourceId,
      tagId,
    });
  }
}
