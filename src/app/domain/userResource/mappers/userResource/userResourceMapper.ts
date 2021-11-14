import { Injectable } from '@nestjs/common';

import { ResourceMapper } from '@domain/resource/mappers/resource/resourceMapper';
import { Tag } from '@domain/tag/entities/tag';
import { TagMapper } from '@domain/tag/mappers/tag/tagMapper';
import { Mapper } from '@shared/mapper/mapper';
import { Nullable } from '@shared/nullable/nullable';

import { UserResourceDTO } from '../../dtos/userResourceDTO';
import { UserResource } from '../../entities/userResource';

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
