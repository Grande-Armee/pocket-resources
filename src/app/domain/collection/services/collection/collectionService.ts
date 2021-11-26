import { Injectable } from '@nestjs/common';

import { PostgresUnitOfWork } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { CollectionDto } from '../../dtos/collectionDto';
import { CollectionCreatedEvent, CollectionUpdatedEvent, CollectionRemovedEvent } from '../../integrationEvents';
import { CollectionRepositoryFactory } from '../../repositories/collection/collectionRepository';
import { CreateCollectionData, UpdateCollectionData } from './interfaces';

@Injectable()
export class CollectionService {
  public constructor(private readonly collectionRepositoryFactory: CollectionRepositoryFactory) {}

  public async createCollection(
    unitOfWork: PostgresUnitOfWork,
    collectionData: CreateCollectionData,
  ): Promise<CollectionDto> {
    const entityManager = unitOfWork.getEntityManager();
    const integrationEventsDispatcher = unitOfWork.getIntegrationEventsDispatcher();
    const collectionRepository = this.collectionRepositoryFactory.create(entityManager);

    const collection = await collectionRepository.createOne(collectionData);

    integrationEventsDispatcher.addEvent(
      new CollectionCreatedEvent(
        {
          id: collection.id,
        },
        'id',
        new Date(),
      ),
    );

    return collection;
  }

  public async findCollection(unitOfWork: PostgresUnitOfWork, collectionId: string): Promise<CollectionDto> {
    const entityManager = unitOfWork.getEntityManager();
    const collectionRepository = this.collectionRepositoryFactory.create(entityManager);

    const collection = await collectionRepository.findOneById(collectionId);

    if (!collection) {
      throw new Error(`Collection with id ${collectionId} not found.`);
    }

    return collection;
  }

  public async updateCollection(
    unitOfWork: PostgresUnitOfWork,
    collectionId: string,
    collectionData: UpdateCollectionData,
  ): Promise<CollectionDto> {
    const entityManager = unitOfWork.getEntityManager();
    const integrationEventsDispatcher = unitOfWork.getIntegrationEventsDispatcher();
    const collectionRepository = this.collectionRepositoryFactory.create(entityManager);

    const collection = await collectionRepository.updateOne(collectionId, { ...collectionData });

    integrationEventsDispatcher.addEvent(
      new CollectionUpdatedEvent(
        {
          id: collection.id,
        },
        'id',
        new Date(),
      ),
    );

    return collection;
  }

  public async removeCollection(unitOfWork: PostgresUnitOfWork, collectionId: string): Promise<void> {
    const entityManager = unitOfWork.getEntityManager();
    const integrationEventsDispatcher = unitOfWork.getIntegrationEventsDispatcher();
    const collectionRepository = this.collectionRepositoryFactory.create(entityManager);

    await collectionRepository.removeOne(collectionId);

    integrationEventsDispatcher.addEvent(
      new CollectionRemovedEvent(
        {
          id: collectionId,
        },
        'id',
        new Date(),
      ),
    );
  }
}
