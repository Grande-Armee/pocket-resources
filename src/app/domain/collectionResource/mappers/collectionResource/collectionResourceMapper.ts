import { DtoFactory, Mapper } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';

import { CollectionResourceDto } from '../../dtos/collectionResourceDto';
import { CollectionResource } from '../../entities/collectionResource';

@Injectable()
export class CollectionResourceMapper implements Mapper<CollectionResource, CollectionResourceDto> {
  public constructor(private readonly dtoFactory: DtoFactory) {}

  public mapEntityToDto(entity: CollectionResource): CollectionResourceDto {
    const { id, createdAt, updatedAt, collectionId, resourceId } = entity;

    return this.dtoFactory.create(CollectionResourceDto, {
      id,
      createdAt,
      updatedAt,
      collectionId,
      resourceId,
    });
  }
}
