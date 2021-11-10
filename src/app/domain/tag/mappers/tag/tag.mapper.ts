import { Injectable } from '@nestjs/common';

import { TagDTO } from '../../dtos/tag.dto';
import { Tag } from '../../entities/tag.entity';

// TODO: implements Mapper<T>

@Injectable()
export class TagMapper {
  public mapEntityToDTO(entity: Tag): TagDTO {
    return TagDTO.create({
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
