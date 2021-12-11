import { Injectable } from '@nestjs/common';
import { EntityRepository, EntityManager, FindConditions } from 'typeorm';

import { TagNotFoundError } from '@domain/tag/errors';
import { RepositoryFactory } from '@shared/database/types';

import { TagDto } from '../../dtos/tagDto';
import { Tag } from '../../entities/tag';
import { TagMapper } from '../../mappers/tag/tagMapper';

@EntityRepository()
export class TagRepository {
  public constructor(private readonly manager: EntityManager, private readonly tagMapper: TagMapper) {}

  public async findOne(conditions: FindConditions<Tag>): Promise<TagDto | null> {
    const tag = await this.manager.findOne(Tag, conditions);

    if (!tag) {
      return null;
    }

    return this.tagMapper.mapEntityToDto(tag);
  }

  public async findMany(conditions: FindConditions<Tag>): Promise<TagDto[]> {
    const tags = await this.manager.find(Tag, conditions);

    return tags.map((tag) => this.tagMapper.mapEntityToDto(tag));
  }

  public async createOne(data: Partial<Tag>): Promise<TagDto> {
    const tag = this.manager.create(Tag, { ...data });

    const [savedTag] = await this.manager.save([tag]);

    return this.tagMapper.mapEntityToDto(savedTag);
  }

  public async updateOne(id: string, data: Partial<Tag>): Promise<TagDto> {
    const tag = await this.findOne({ id });

    if (!tag) {
      throw new TagNotFoundError({ id: id });
    }

    await this.manager.update(Tag, { id }, data);

    return this.findOne({ id }) as Promise<TagDto>;
  }

  public async removeOne(id: string): Promise<void> {
    const tag = await this.findOne({ id });

    if (!tag) {
      throw new TagNotFoundError({ id: id });
    }

    await this.manager.delete(Tag, { id });
  }
}

@Injectable()
export class TagRepositoryFactory implements RepositoryFactory<TagRepository> {
  public constructor(private readonly tagMapper: TagMapper) {}

  public create(entityManager: EntityManager): TagRepository {
    return new TagRepository(entityManager, this.tagMapper);
  }
}
