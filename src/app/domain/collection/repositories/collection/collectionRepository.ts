import { Injectable } from '@nestjs/common';
import { EntityRepository, EntityManager, FindConditions } from 'typeorm';

import { RepositoryFactory } from '@src/app/shared/postgres/types';

import { CollectionDto } from '../../dtos/collectionDto';
import { Collection } from '../../entities/collection';
import { CollectionMapper } from '../../mappers/collection/collectionMapper';

@EntityRepository()
export class CollectionRepository {
  public constructor(private readonly manager: EntityManager, private readonly collectionMapper: CollectionMapper) {}

  public async findOne(conditions: FindConditions<Collection>): Promise<CollectionDto | null> {
    const queryBuilder = this.manager.getRepository(Collection).createQueryBuilder('collection');

    const collection = await queryBuilder
      .leftJoinAndSelect('collection.collectionResources', 'collectionResources')
      .leftJoinAndSelect('collectionResources.resource', 'resource')
      .where(conditions)
      .getOne();

    if (!collection) {
      return null;
    }

    return this.collectionMapper.mapEntityToDto(collection);
  }

  public async findMany(conditions: FindConditions<Collection>): Promise<CollectionDto[]> {
    const queryBuilder = this.manager.getRepository(Collection).createQueryBuilder('collection');

    const collections = await queryBuilder
      .leftJoinAndSelect('collection.collectionResources', 'collectionResources')
      .leftJoinAndSelect('collectionResources.resource', 'resource')
      .where(conditions)
      .getMany();

    return collections.map((collection) => this.collectionMapper.mapEntityToDto(collection));
  }

  public async createOne(collectionData: Partial<Collection>): Promise<CollectionDto> {
    const collection = this.manager.create(Collection, { ...collectionData });

    const [savedCollection] = await this.manager.save([collection]);

    return this.collectionMapper.mapEntityToDto(savedCollection);
  }

  public async findOneById(id: string): Promise<CollectionDto | null> {
    return this.findOne({ id });
  }

  public async updateOne(id: string, data: Partial<Collection>): Promise<CollectionDto> {
    const collection = await this.findOneById(id);

    if (!collection) {
      throw new Error('Collection not found');
    }

    await this.manager.update(Collection, { id }, data);

    return this.findOneById(id) as Promise<CollectionDto>;
  }

  public async removeOne(id: string): Promise<void> {
    const collection = await this.findOneById(id);

    if (!collection) {
      throw new Error('Collection not found');
    }

    await this.manager.delete(Collection, { id });
  }
}

@Injectable()
export class CollectionRepositoryFactory implements RepositoryFactory<CollectionRepository> {
  public constructor(private readonly collectionMapper: CollectionMapper) {}

  public create(entityManager: EntityManager): CollectionRepository {
    return new CollectionRepository(entityManager, this.collectionMapper);
  }
}
