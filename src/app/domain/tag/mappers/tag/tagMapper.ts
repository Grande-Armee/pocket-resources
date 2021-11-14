import { Injectable } from '@nestjs/common';

import { Mapper } from '../../../../shared/mapper/mapper';
import { TagDTO } from '../../dtos/tagDTO';
import { Tag } from '../../entities/tag';

@Injectable()
export class TagMapper implements Mapper<Tag, TagDTO> {
  public mapEntityToDTO(entity: Tag): TagDTO {
    const { id, createdAt, updatedAt, color, title, userId } = entity;

    return TagDTO.create({
      id,
      createdAt,
      updatedAt,
      color,
      title,
      userId,
    });
  }
}
