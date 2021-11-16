import { Injectable } from '@nestjs/common';
import { EntityRepository, EntityManager, FindConditions } from 'typeorm';

import { RepositoryFactory } from '@shared/postgres/interfaces';

import { CollectionResourceDto } from '../../dtos/collectionResourceDto';
import { CollectionResource } from '../../entities/collectionResource';
import { CollectionResourceMapper } from '../../mappers/collectionResource/collectionResourceMapper';

@EntityRepository()
export class CollectionResourceRepository {
  public constructor(
    private readonly manager: EntityManager,
    private readonly collectionResourceMapper: CollectionResourceMapper,
  ) {}

  public async findOne(conditions: FindConditions<CollectionResource>): Promise<CollectionResourceDto | null> {
    const collectionResource = await this.manager.findOne(CollectionResource, conditions);

    if (!collectionResource) {
      return null;
    }

    return this.collectionResourceMapper.mapEntityToDto(collectionResource);
  }

  public async findOneById(id: string): Promise<CollectionResourceDto | null> {
    return this.findOne({ id });
  }

  public async findMany(conditions: FindConditions<CollectionResource>): Promise<CollectionResourceDto[]> {
    const collectionResources = await this.manager.find(CollectionResource, conditions);

    return collectionResources.map((collectionResource) =>
      this.collectionResourceMapper.mapEntityToDto(collectionResource),
    );
  }

  public async createOne(data: Partial<CollectionResource>): Promise<CollectionResourceDto> {
    const collectionResource = this.manager.create(CollectionResource, { ...data });

    const [savedCollectionResource] = await this.manager.save([collectionResource]);

    return this.collectionResourceMapper.mapEntityToDto(savedCollectionResource);
  }

  public async removeOne(id: string): Promise<void> {
    const collectionResource = await this.findOneById(id);

    if (!collectionResource) {
      throw new Error('Collection resource not found');
    }

    await this.manager.delete(CollectionResource, { id });
  }
}

@Injectable()
export class CollectionResourceRepositoryFactory implements RepositoryFactory<CollectionResourceRepository> {
  public constructor(private readonly collectionResourceMapper: CollectionResourceMapper) {}

  public create(entityManager: EntityManager): CollectionResourceRepository {
    return new CollectionResourceRepository(entityManager, this.collectionResourceMapper);
  }
}
