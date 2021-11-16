import { Injectable } from '@nestjs/common';

import { UnitOfWork } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { CollectionCreatedEvent, CollectionUpdatedEvent, CollectionRemovedEvent } from '../../domainEvents';
import { CollectionDto } from '../../dtos/collectionDto';
import { CollectionRepositoryFactory } from '../../repositories/collection/collectionRepository';
import { CreateCollectionData, UpdateCollectionData } from './interfaces';

@Injectable()
export class CollectionService {
  public constructor(private readonly collectionRepositoryFactory: CollectionRepositoryFactory) {}

  public async createCollection(unitOfWork: UnitOfWork, collectionData: CreateCollectionData): Promise<CollectionDto> {
    const entityManager = unitOfWork.getEntityManager();
    const domainEventsDispatcher = unitOfWork.getDomainEventsDispatcher();
    const collectionRepository = this.collectionRepositoryFactory.create(entityManager);

    const collection = await collectionRepository.createOne(collectionData);

    domainEventsDispatcher.addEvent(
      new CollectionCreatedEvent({
        id: collection.id,
      }),
    );

    return collection;
  }

  public async findCollection(unitOfWork: UnitOfWork, collectionId: string): Promise<CollectionDto> {
    const entityManager = unitOfWork.getEntityManager();
    const collectionRepository = this.collectionRepositoryFactory.create(entityManager);

    const collection = await collectionRepository.findOneById(collectionId);

    if (!collection) {
      throw new Error(`Collection with id ${collectionId} not found.`);
    }

    return collection;
  }

  public async updateCollection(
    unitOfWork: UnitOfWork,
    collectionId: string,
    collectionData: UpdateCollectionData,
  ): Promise<CollectionDto> {
    const entityManager = unitOfWork.getEntityManager();
    const domainEventsDispatcher = unitOfWork.getDomainEventsDispatcher();
    const collectionRepository = this.collectionRepositoryFactory.create(entityManager);

    const collection = await collectionRepository.updateOne(collectionId, { ...collectionData });

    domainEventsDispatcher.addEvent(
      new CollectionUpdatedEvent({
        id: collection.id,
      }),
    );

    return collection;
  }

  public async removeCollection(unitOfWork: UnitOfWork, collectionId: string): Promise<void> {
    const entityManager = unitOfWork.getEntityManager();
    const domainEventsDispatcher = unitOfWork.getDomainEventsDispatcher();
    const collectionRepository = this.collectionRepositoryFactory.create(entityManager);

    await collectionRepository.removeOne(collectionId);

    domainEventsDispatcher.addEvent(
      new CollectionRemovedEvent({
        id: collectionId,
      }),
    );
  }
}
