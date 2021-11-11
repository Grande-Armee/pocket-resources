import { Injectable } from '@nestjs/common';

import { ResourceDTO } from '../../dtos/resource.dto';
import { Resource } from '../../entities/resource.entity';

@Injectable()
export class ResourceMapper {
  public mapEntityToDTO(entity: Resource): ResourceDTO {
    return ResourceDTO.create({
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      title: entity.title,
      content: entity.content,
      url: entity.url,
      thumbnailUrl: entity.thumbnailUrl,
    });
  }
}
