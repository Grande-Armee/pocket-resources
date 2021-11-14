import { Injectable } from '@nestjs/common';

import { Mapper } from '../../../../shared/mapper/mapper';
import { ResourceDTO } from '../../dtos/resourceDTO';
import { Resource } from '../../entities/resource';

@Injectable()
export class ResourceMapper implements Mapper<Resource, ResourceDTO> {
  public mapEntityToDTO(entity: Resource): ResourceDTO {
    const { id, createdAt, updatedAt, title, thumbnailUrl, url, content } = entity;

    return ResourceDTO.create({
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
