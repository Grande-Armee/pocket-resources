import { LoggerService } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';

import { CollectionResourceNotFoundError } from '@domain/collectionResource/errors';
import { PostgresUnitOfWork } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { CollectionResourceDto } from '../../dtos/collectionResourceDto';
import { CollectionResourceCreatedEvent, CollectionResourceRemovedEvent } from '../../integrationEvents';
import { CollectionResourceRepositoryFactory } from '../../repositories/collectionResource/collectionResourceRepository';
import { CreateCollectionResourceData, RemoveCollectionResourceData } from './types';

@Injectable()
export class CollectionResourceService {
  public constructor(
    private readonly collectionResourceRepositoryFactory: CollectionResourceRepositoryFactory,
    private readonly logger: LoggerService,
  ) {}

  public async createCollectionResource(
    unitOfWork: PostgresUnitOfWork,
    collectionResourceData: CreateCollectionResourceData,
  ): Promise<CollectionResourceDto> {
    this.logger.debug('Creating collection resource...', {
      collectionId: collectionResourceData.collectionId,
      resourceId: collectionResourceData.resourceId,
    });

    const { entityManager, integrationEventsStore } = unitOfWork;
    const collectionResourceRepository = this.collectionResourceRepositoryFactory.create(entityManager);

    const collectionResource = await collectionResourceRepository.createOne(collectionResourceData);

    integrationEventsStore.addEvent(
      new CollectionResourceCreatedEvent({
        id: collectionResource.id,
        createdAt: collectionResource.createdAt,
        updatedAt: collectionResource.updatedAt,
        collectionId: collectionResource.collectionId,
        resourceId: collectionResource.resourceId,
      }),
    );

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

    const { entityManager, integrationEventsStore } = unitOfWork;
    const collectionResourceRepository = this.collectionResourceRepositoryFactory.create(entityManager);

    const foundCollectionResource = await collectionResourceRepository.findOne({ ...collectionResourceData });

    if (!foundCollectionResource) {
      throw new CollectionResourceNotFoundError({
        collectionId: collectionResourceData.collectionId,
        resourceId: collectionResourceData.resourceId,
      });
    }

    await collectionResourceRepository.removeOne(foundCollectionResource.id);

    integrationEventsStore.addEvent(
      new CollectionResourceRemovedEvent({
        id: foundCollectionResource.id,
      }),
    );

    this.logger.info('Collection resource removed.', { collectionResourceId: foundCollectionResource.id });
  }
}
