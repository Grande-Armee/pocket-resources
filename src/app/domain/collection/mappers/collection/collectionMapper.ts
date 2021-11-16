import { DtoFactory, Mapper, Nullable } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';

import { Resource } from '@domain/resource/entities/resource';
import { ResourceMapper } from '@domain/resource/mappers/resource/resourceMapper';

import { CollectionDto } from '../../dtos/collectionDto';
import { Collection } from '../../entities/collection';

@Injectable()
export class CollectionMapper implements Mapper<Collection, CollectionDto> {
  public constructor(private readonly dtoFactory: DtoFactory, private readonly resourceMapper: ResourceMapper) {}

  public mapEntityToDto(entity: Collection): CollectionDto {
    const { id, createdAt, updatedAt, title, thumbnailUrl, content, userId, collectionResources } = entity;

    const nullableResourcesDto = Nullable.wrap(collectionResources).map((collectionResources) =>
      collectionResources.map((collectionResource) =>
        this.resourceMapper.mapEntityToDto(collectionResource.resource as Resource),
      ),
    );

    return this.dtoFactory.createDtoInstance(CollectionDto, {
      id,
      createdAt,
      updatedAt,
      title: title || null,
      thumbnailUrl: thumbnailUrl || null,
      content: content || null,
      userId: userId,
      resources: nullableResourcesDto.toValue(),
    });
  }
}
