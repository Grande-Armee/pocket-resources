import { Mapper } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';

import { TagDto } from '../../dtos/tagDto';
import { Tag } from '../../entities/tag';

@Injectable()
export class TagMapper implements Mapper<Tag, TagDto> {
  public mapEntityToDto(entity: Tag): TagDto {
    const { id, createdAt, updatedAt, color, title, userId } = entity;

    return TagDto.create({
      id,
      createdAt,
      updatedAt,
      color,
      title,
      userId,
    });
  }
}
