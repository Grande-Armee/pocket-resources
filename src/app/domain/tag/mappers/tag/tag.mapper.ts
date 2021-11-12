import { Injectable } from '@nestjs/common';

import { Mapper } from '../../../../shared/mapper/mapper';
import { TagDTO } from '../../dtos/tag.dto';
import { Tag } from '../../entities/tag.entity';

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
