import { Injectable } from '@nestjs/common';

import { Tag } from '../../../../domain/tag/entities/tag.entity';
import { Mapper } from '../../../../shared/mapper/mapper';
import { Nullable } from '../../../../shared/nullable/nullable';
import { ResourceMapper } from '../../../resource/mappers/resource/resource.mapper';
import { TagMapper } from '../../../tag/mappers/tag/tag.mapper';
import { UserResourceDTO } from '../../dtos/user-resource.dto';
import { UserResource } from '../../entities/user-resource.entity';

@Injectable()
export class UserResourceMapper implements Mapper<UserResource, UserResourceDTO> {
  public constructor(private readonly resourceMapper: ResourceMapper, private readonly tagMapper: TagMapper) {}

  public mapEntityToDTO(entity: UserResource): UserResourceDTO {
    const { id, createdAt, updatedAt, status, isFavorite, rating, resource, resourceId, userId, userResourceTags } =
      entity;

    const nullableResourceDTO = Nullable.wrap(resource).map((resource) => this.resourceMapper.mapEntityToDTO(resource));

    const nullableTagsDTO = Nullable.wrap(userResourceTags).map((userResourceTags) =>
      userResourceTags.map((userResourceTag) => this.tagMapper.mapEntityToDTO(userResourceTag.tag as Tag)),
    );

    return UserResourceDTO.create({
      id,
      createdAt,
      updatedAt,
      status,
      isFavorite,
      rating,
      resourceId,
      userId,
      resource: nullableResourceDTO.toValue(),
      tags: nullableTagsDTO.toValue(),
    });
  }
}
