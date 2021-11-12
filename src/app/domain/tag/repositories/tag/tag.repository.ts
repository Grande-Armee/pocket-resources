import { Injectable } from '@nestjs/common';
import { EntityRepository, EntityManager } from 'typeorm';

import { RepositoryFactory } from '../../../../shared/postgres/interfaces';
import { TagDTO } from '../../dtos/tag.dto';
import { Tag } from '../../entities/tag.entity';
import { TagMapper } from '../../mappers/tag/tag.mapper';

@EntityRepository()
export class TagRepository {
  public constructor(private readonly manager: EntityManager, private readonly tagMapper: TagMapper) {}

  public async createOne(tagData: Partial<Tag>): Promise<TagDTO> {
    const tag = this.manager.create(Tag, { ...tagData });

    const [savedTag] = await this.manager.save([tag]);

    return this.tagMapper.mapEntityToDTO(savedTag);
  }

  public async findOne(tagData: Partial<Tag>): Promise<TagDTO | null> {
    const tag = await this.manager.findOne(Tag, { ...tagData });

    if (!tag) {
      return null;
    }

    return this.tagMapper.mapEntityToDTO(tag);
  }

  public async findAll(): Promise<TagDTO[]> {
    const tags = await this.manager.find(Tag, {});

    return tags.map((tag) => this.tagMapper.mapEntityToDTO(tag));
  }

  public async updateOne(id: string, data: Partial<Tag>): Promise<TagDTO> {
    const tag = await this.findOne({ id });

    if (!tag) {
      throw new Error('Tag not found');
    }

    await this.manager.update(Tag, { id }, data);

    return this.findOne({ id }) as Promise<TagDTO>;
  }

  public async removeOne(id: string): Promise<void> {
    const tag = await this.findOne({ id });

    if (!tag) {
      throw new Error('Tag not found');
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
