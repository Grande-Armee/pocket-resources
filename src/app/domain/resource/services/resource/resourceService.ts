import { LoggerService } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';

import { ResourceNotFoundError } from '@domain/resource/errors';
import { ResourceAlreadyExistsError } from '@domain/resource/errors/resourceAlreadyExistsError';
import { PostgresUnitOfWork } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { ResourceDto } from '../../dtos/resourceDto';
import { ResourceCreatedEvent, ResourceUpdatedEvent, ResourceRemovedEvent } from '../../integrationEvents';
import { ResourceRepositoryFactory } from '../../repositories/resource/resourceRepository';
import { CreateResourceData, UpdateResourceData } from './types';

@Injectable()
export class ResourceService {
  public constructor(
    private readonly resourceRepositoryFactory: ResourceRepositoryFactory,
    private readonly logger: LoggerService,
  ) {}

  public async createResource(unitOfWork: PostgresUnitOfWork, resourceData: CreateResourceData): Promise<ResourceDto> {
    this.logger.debug('Creating resource...');

    const { entityManager, integrationEventsStore } = unitOfWork;
    const resourceRepository = this.resourceRepositoryFactory.create(entityManager);

    const existingResource = await resourceRepository.findOneByUrl(resourceData.url);

    if (existingResource) {
      throw new ResourceAlreadyExistsError({ url: resourceData.url });
    }

    const resource = await resourceRepository.createOne(resourceData);

    integrationEventsStore.addEvent(
      new ResourceCreatedEvent({
        id: resource.id,
        createdAt: resource.createdAt,
        updatedAt: resource.updatedAt,
        url: resource.url,
        title: resource.title,
        thumbnailUrl: resource.thumbnailUrl,
        content: resource.content,
      }),
    );

    this.logger.info('Resource created.', { resourceId: resource.id });

    return resource;
  }

  public async findResource(unitOfWork: PostgresUnitOfWork, resourceId: string): Promise<ResourceDto> {
    const { entityManager } = unitOfWork;
    const resourceRepository = this.resourceRepositoryFactory.create(entityManager);

    const resource = await resourceRepository.findOneById(resourceId);

    if (!resource) {
      throw new ResourceNotFoundError({ id: resourceId });
    }

    return resource;
  }

  public async updateResource(
    unitOfWork: PostgresUnitOfWork,
    resourceId: string,
    resourceData: UpdateResourceData,
  ): Promise<ResourceDto> {
    this.logger.debug('Updating resource...', { resourceId: resourceId });

    const { entityManager, integrationEventsStore } = unitOfWork;
    const resourceRepository = this.resourceRepositoryFactory.create(entityManager);

    const resource = await resourceRepository.updateOne(resourceId, { ...resourceData });

    integrationEventsStore.addEvent(
      new ResourceUpdatedEvent({
        id: resource.id,
        createdAt: resource.createdAt,
        updatedAt: resource.updatedAt,
        url: resource.url,
        title: resource.title,
        thumbnailUrl: resource.thumbnailUrl,
        content: resource.content,
      }),
    );

    this.logger.info('Resource updated.', { resourceId: resource.id });

    return resource;
  }

  public async removeResource(unitOfWork: PostgresUnitOfWork, resourceId: string): Promise<void> {
    this.logger.debug('Removing resource...', { resourceId: resourceId });

    const { entityManager, integrationEventsStore } = unitOfWork;
    const resourceRepository = this.resourceRepositoryFactory.create(entityManager);

    await resourceRepository.removeOne(resourceId);

    integrationEventsStore.addEvent(
      new ResourceRemovedEvent({
        id: resourceId,
      }),
    );

    this.logger.info('Resource removed.', { resourceId: resourceId });
  }
}
