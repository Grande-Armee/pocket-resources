import { Injectable } from '@nestjs/common';

import { ResourceDTO } from '../../dtos/resource.dto';
import { ResourceEntity } from '../../entities/resource.entity';

@Injectable()
export class ResourceMapper {
  public mapEntityToDTO(entity: ResourceEntity): ResourceDTO {
    return ResourceDTO.create({
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
