import { LoggerService } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';

import { PostgresUnitOfWork } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { CollectionResourceDto } from '../../dtos/collectionResourceDto';
import { CollectionResourceRepositoryFactory } from '../../repositories/collectionResource/collectionResourceRepository';
import { CreateCollectionResourceData, RemoveCollectionResourceData } from './interfaces';

@Injectable()
export class CollectionResourceService {
  public constructor(
    private readonly collectionResourceRepositoryFactory: CollectionResourceRepositoryFactory,
    private readonly logger: LoggerService,
  ) {}

  public async findCollectionResource(
    unitOfWork: PostgresUnitOfWork,
    collectionResourceId: string,
  ): Promise<CollectionResourceDto> {
    const { entityManager } = unitOfWork;
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
    this.logger.debug('Creating collection resource...', {
      collectionId: collectionResourceData.collectionId,
      resourceId: collectionResourceData.resourceId,
    });

    const { entityManager } = unitOfWork;
    const collectionResourceRepository = this.collectionResourceRepositoryFactory.create(entityManager);

    const collectionResource = await collectionResourceRepository.createOne(collectionResourceData);

    this.logger.info('Collection resource created.', { collectionResourceId: collectionResource.id });

    return collectionResource;
  }

  public async removeCollectionResource(
    unitOfWork: PostgresUnitOfWork,
    collectionResourceData: RemoveCollectionResourceData,
  ): Promise<void> {
    this.logger.debug('Removing collection resource...', {
      collectionId: collectionResourceData.collectionId,
      resourceId: collectionResourceData.resourceId,
    });

    const { entityManager } = unitOfWork;
    const collectionResourceRepository = this.collectionResourceRepositoryFactory.create(entityManager);

    const foundCollectionResource = await collectionResourceRepository.findOne({ ...collectionResourceData });

    if (!foundCollectionResource) {
      throw new Error('Collection resource not found.');
    }

    await collectionResourceRepository.removeOne(foundCollectionResource.id);

    this.logger.info('Collection resource removed.', { collectionResourceId: foundCollectionResource.id });
  }
}
