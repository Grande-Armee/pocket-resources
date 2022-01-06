import { Mapper, Nullable } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';

import { ResourceMapper } from '@domain/resource/mappers/resource/resourceMapper';
import { Tag } from '@domain/tag/entities/tag';
import { TagMapper } from '@domain/tag/mappers/tag/tagMapper';

import { UserResourceDto } from '../../dtos/userResourceDto';
import { UserResource } from '../../entities/userResource';

@Injectable()
export class UserResourceMapper implements Mapper<UserResource, UserResourceDto> {
  public constructor(private readonly resourceMapper: ResourceMapper, private readonly tagMapper: TagMapper) {}

  public mapEntityToDto(entity: UserResource): UserResourceDto {
    const { id, createdAt, updatedAt, status, isFavorite, rating, resource, resourceId, userId, userResourceTags } =
      entity;

    const nullableResourceDto = Nullable.wrap(resource).map((resource) => this.resourceMapper.mapEntityToDto(resource));

    const nullableTagsDto = Nullable.wrap(userResourceTags).map((userResourceTags) =>
      userResourceTags.map((userResourceTag) => this.tagMapper.mapEntityToDto(userResourceTag.tag as Tag)),
    );

    return UserResourceDto.create({
      id,
      createdAt,
      updatedAt,
      status,
      isFavorite,
      rating,
      resourceId,
      userId,
      resource: nullableResourceDto.toValue(),
      tags: nullableTagsDto.toValue(),
    });
  }
}
