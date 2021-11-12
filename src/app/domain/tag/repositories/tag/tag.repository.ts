import { Injectable } from '@nestjs/common';
import { EntityRepository, EntityManager } from 'typeorm';

import { RepositoryFactory } from '../../../../shared/postgres/interfaces';
import { TagDTO } from '../../dtos/tag.dto';
import { Tag } from '../../entities/tag.entity';
import { TagMapper } from '../../mappers/tag/tag.mapper';

@EntityRepository()
export class TagRepository {
  public constructor(private readonly manager: EntityManager, private readonly tagMapper: TagMapper) {}

  public async findOneById(id: string): Promise<TagDTO | null> {
    const tag = await this.manager.findOne(Tag, { id });

    if (!tag) {
      return null;
    }

    return this.tagMapper.mapEntityToDTO(tag);
  }

  public async createOne(data: Partial<Tag>): Promise<TagDTO> {
    const tag = this.manager.create(Tag, { ...data });

    const [savedTag] = await this.manager.save([tag]);

    return this.tagMapper.mapEntityToDTO(savedTag);
  }
}

@Injectable()
export class TagRepositoryFactory implements RepositoryFactory<TagRepository> {
  public constructor(private readonly tagMapper: TagMapper) {}

  public create(entityManager: EntityManager): TagRepository {
    return new TagRepository(entityManager, this.tagMapper);
  }
}
