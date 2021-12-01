import { Injectable } from '@nestjs/common';

import { PostgresUnitOfWork } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { ResourceDto } from '../../dtos/resourceDto';
import { ResourceCreatedEvent, ResourceUpdatedEvent, ResourceRemovedEvent } from '../../integrationEvents';
import { ResourceRepositoryFactory } from '../../repositories/resource/resourceRepository';
import { CreateResourceData, UpdateResourceData } from './interfaces';

@Injectable()
export class ResourceService {
  public constructor(private readonly resourceRepositoryFactory: ResourceRepositoryFactory) {}

  public async createResource(unitOfWork: PostgresUnitOfWork, resourceData: CreateResourceData): Promise<ResourceDto> {
    const { entityManager, integrationEventsDispatcher } = unitOfWork;
    const resourceRepository = this.resourceRepositoryFactory.create(entityManager);

    const existingResource = await resourceRepository.findOneByUrl(resourceData.url);

    if (existingResource) {
      throw new Error(`Resource with url: ${resourceData.url} already exists.`);
    }

    const resource = await resourceRepository.createOne(resourceData);

    integrationEventsDispatcher.addEvent(
      new ResourceCreatedEvent(
        {
          id: resource.id,
        },
        'id',
        new Date(),
      ),
    );

    return resource;
  }

  public async findResource(unitOfWork: PostgresUnitOfWork, resourceId: string): Promise<ResourceDto> {
    const { entityManager } = unitOfWork;
    const resourceRepository = this.resourceRepositoryFactory.create(entityManager);

    const resource = await resourceRepository.findOneById(resourceId);

    if (!resource) {
      throw new Error('Resource not found.');
    }

    return resource;
  }

  public async updateResource(
    unitOfWork: PostgresUnitOfWork,
    resourceId: string,
    resourceData: UpdateResourceData,
  ): Promise<ResourceDto> {
    const { entityManager, integrationEventsDispatcher } = unitOfWork;
    const resourceRepository = this.resourceRepositoryFactory.create(entityManager);

    const resource = await resourceRepository.updateOne(resourceId, { ...resourceData });

    integrationEventsDispatcher.addEvent(
      new ResourceUpdatedEvent(
        {
          id: resource.id,
        },
        'id',
        new Date(),
      ),
    );

    return resource;
  }

  public async removeResource(unitOfWork: PostgresUnitOfWork, resourceId: string): Promise<void> {
    const { entityManager, integrationEventsDispatcher } = unitOfWork;
    const resourceRepository = this.resourceRepositoryFactory.create(entityManager);

    await resourceRepository.removeOne(resourceId);

    integrationEventsDispatcher.addEvent(
      new ResourceRemovedEvent(
        {
          id: resourceId,
        },
        'id',
        new Date(),
      ),
    );
  }
}
