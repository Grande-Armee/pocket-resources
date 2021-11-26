import { Injectable } from '@nestjs/common';

import { PostgresUnitOfWork } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { CollectionResourceDto } from '../../dtos/collectionResourceDto';
import { CollectionResourceRepositoryFactory } from '../../repositories/collectionResource/collectionResourceRepository';
import { CreateCollectionResourceData, RemoveCollectionResourceData } from './interfaces';

@Injectable()
export class CollectionResourceService {
  public constructor(private readonly collectionResourceRepositoryFactory: CollectionResourceRepositoryFactory) {}

  public async findCollectionResource(
    unitOfWork: PostgresUnitOfWork,
    collectionResourceId: string,
  ): Promise<CollectionResourceDto> {
    const entityManager = unitOfWork.getEntityManager();
    const collectionResourceRepository = this.collectionResourceRepositoryFactory.create(entityManager);

    const collectionResource = await collectionResourceRepository.findOneById(collectionResourceId);

    if (!collectionResource) {
      throw new Error('Collection resource not found.');
    }

    return collectionResource;
  }

  public async createCollectionResource(
    unitOfWork: PostgresUnitOfWork,
    collectionResourceData: CreateCollectionResourceData,
  ): Promise<CollectionResourceDto> {
    const entityManager = unitOfWork.getEntityManager();
    const collectionResourceRepository = this.collectionResourceRepositoryFactory.create(entityManager);

    const collectionResource = await collectionResourceRepository.createOne(collectionResourceData);

    return collectionResource;
  }

  public async removeCollectionResource(
    unitOfWork: PostgresUnitOfWork,
    collectionResourceData: RemoveCollectionResourceData,
  ): Promise<void> {
    const entityManager = unitOfWork.getEntityManager();
    const collectionResourceRepository = this.collectionResourceRepositoryFactory.create(entityManager);

    const foundCollectionResource = await collectionResourceRepository.findOne({ ...collectionResourceData });

    if (!foundCollectionResource) {
      throw new Error('Collection resource not found.');
    }

    await collectionResourceRepository.removeOne(foundCollectionResource.id);
  }
}
