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

  public async createOne(): Promise<TagDTO> {
    // TODO: remove hardcoded id
    const tag = this.manager.create(Tag, {
      id: 'ef492cef-c478-4974-8555-97adadcc5c15',
      color: 'asd',
      title: 'asd',
      userId: 'a6a18f2d-46f6-47e9-8c5d-ce7352fa22d5',
    });

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
