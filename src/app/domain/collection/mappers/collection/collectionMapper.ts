import { DtoFactory, Mapper } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';

import { CollectionDto } from '../../dtos/collectionDto';
import { Collection } from '../../entities/collection';

@Injectable()
export class CollectionMapper implements Mapper<Collection, CollectionDto> {
  public constructor(private readonly dtoFactory: DtoFactory) {}

  public mapEntityToDto(entity: Collection): CollectionDto {
    const { id, createdAt, updatedAt, title, thumbnailUrl, content, userId } = entity;

    return this.dtoFactory.createDtoInstance(CollectionDto, {
      id,
      createdAt,
      updatedAt,
      title: title || null,
      thumbnailUrl: thumbnailUrl || null,
      content: content || null,
      userId: userId,
    });
  }
}
