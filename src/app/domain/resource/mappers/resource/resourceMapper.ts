import { DtoFactory, Mapper } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';

import { ResourceDto } from '../../dtos/resourceDto';
import { Resource } from '../../entities/resource';

@Injectable()
export class ResourceMapper implements Mapper<Resource, ResourceDto> {
  public constructor(private readonly dtoFactory: DtoFactory) {}

  public mapEntityToDto(entity: Resource): ResourceDto {
    const { id, createdAt, updatedAt, title, thumbnailUrl, url, content } = entity;

    return this.dtoFactory.create(ResourceDto, {
      id,
      createdAt,
      updatedAt,
      url,
      title: title || null,
      thumbnailUrl: thumbnailUrl || null,
      content: content || null,
    });
  }
}
