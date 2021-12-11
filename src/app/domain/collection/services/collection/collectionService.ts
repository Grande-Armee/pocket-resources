import { LoggerService } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';

import { CollectionNotFoundError } from '@domain/collection/errors';
import { PostgresUnitOfWork } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { CollectionDto } from '../../dtos/collectionDto';
import { CollectionCreatedEvent, CollectionUpdatedEvent, CollectionRemovedEvent } from '../../integrationEvents';
import { CollectionRepositoryFactory } from '../../repositories/collection/collectionRepository';
import { CreateCollectionData, UpdateCollectionData } from './types';

@Injectable()
export class CollectionService {
  public constructor(
    private readonly collectionRepositoryFactory: CollectionRepositoryFactory,
    private readonly logger: LoggerService,
  ) {}

  public async createCollection(
    unitOfWork: PostgresUnitOfWork,
    collectionData: CreateCollectionData,
  ): Promise<CollectionDto> {
    this.logger.debug('Creating collection...');

    const { entityManager, integrationEventsStore } = unitOfWork;
    const collectionRepository = this.collectionRepositoryFactory.create(entityManager);

    const collection = await collectionRepository.createOne(collectionData);

    integrationEventsStore.addEvent(
      new CollectionCreatedEvent({
        id: collection.id,
        createdAt: collection.createdAt,
        updatedAt: collection.updatedAt,
        content: collection.content,
        thumbnailUrl: collection.thumbnailUrl,
        title: collection.title,
        userId: collection.userId,
        resources: collection.resources,
      }),
    );

    this.logger.info('Collection created.', { collectionId: collection.id });

    return collection;
  }

  public async findCollection(unitOfWork: PostgresUnitOfWork, collectionId: string): Promise<CollectionDto> {
    const { entityManager } = unitOfWork;
    const collectionRepository = this.collectionRepositoryFactory.create(entityManager);

    const collection = await collectionRepository.findOne({ id: collectionId });

    if (!collection) {
      throw new CollectionNotFoundError({ id: collectionId });
    }

    return collection;
  }

  public async updateCollection(
    unitOfWork: PostgresUnitOfWork,
    collectionId: string,
    collectionData: UpdateCollectionData,
  ): Promise<CollectionDto> {
    this.logger.debug('Updating collection...', { collectionId: collectionId });

    const { entityManager, integrationEventsStore } = unitOfWork;
    const collectionRepository = this.collectionRepositoryFactory.create(entityManager);

    const collection = await collectionRepository.updateOne(collectionId, { ...collectionData });

    integrationEventsStore.addEvent(
      new CollectionUpdatedEvent({
        id: collection.id,
        createdAt: collection.createdAt,
        updatedAt: collection.updatedAt,
        content: collection.content,
        thumbnailUrl: collection.thumbnailUrl,
        title: collection.title,
        userId: collection.userId,
        resources: collection.resources,
      }),
    );

    this.logger.info('Collection updated.', { collectionId: collection.id });

    return collection;
  }

  public async removeCollection(unitOfWork: PostgresUnitOfWork, collectionId: string): Promise<void> {
    this.logger.debug('Removing collection...', { collectionId: collectionId });

    const { entityManager, integrationEventsStore } = unitOfWork;
    const collectionRepository = this.collectionRepositoryFactory.create(entityManager);

    await collectionRepository.removeOne(collectionId);

    integrationEventsStore.addEvent(
      new CollectionRemovedEvent({
        id: collectionId,
      }),
    );

    this.logger.info('Collection removed.', { collectionId: collectionId });
  }
}
