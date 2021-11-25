import { Injectable } from '@nestjs/common';

import { UnitOfWork } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { CollectionResourceDto } from '../../dtos/collectionResourceDto';
import { CollectionResourceRepositoryFactory } from '../../repositories/collectionResource/collectionResourceRepository';
import { CreateCollectionResourceData } from './interfaces';

@Injectable()
export class CollectionResourceService {
  public constructor(private readonly collectionResourceRepositoryFactory: CollectionResourceRepositoryFactory) {}

  public async findCollectionResource(
    unitOfWork: UnitOfWork,
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
    unitOfWork: UnitOfWork,
    collectionResourceData: CreateCollectionResourceData,
  ): Promise<CollectionResourceDto> {
    const entityManager = unitOfWork.getEntityManager();
    const collectionResourceRepository = this.collectionResourceRepositoryFactory.create(entityManager);

    const collectionResource = await collectionResourceRepository.createOne(collectionResourceData);

    return collectionResource;
  }

  public async removeCollectionResource(unitOfWork: UnitOfWork, collectionResourceId: string): Promise<void> {
    const entityManager = unitOfWork.getEntityManager();
    const collectionResourceRepository = this.collectionResourceRepositoryFactory.create(entityManager);

    await collectionResourceRepository.removeOne(collectionResourceId);
  }
}
