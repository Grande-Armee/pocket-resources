import { Injectable } from '@nestjs/common';

import { PostgresUnitOfWork } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { ResourceCreatedEvent, ResourceUpdatedEvent, ResourceRemovedEvent } from '../../domainEvents';
import { ResourceDto } from '../../dtos/resourceDto';
import { ResourceRepositoryFactory } from '../../repositories/resource/resourceRepository';
import { CreateResourceData, UpdateResourceData } from './interfaces';

@Injectable()
export class ResourceService {
  public constructor(private readonly resourceRepositoryFactory: ResourceRepositoryFactory) {}

  public async createResource(unitOfWork: PostgresUnitOfWork, resourceData: CreateResourceData): Promise<ResourceDto> {
    const entityManager = unitOfWork.getEntityManager();
    const domainEventsDispatcher = unitOfWork.getDomainEventsDispatcher();
    const resourceRepository = this.resourceRepositoryFactory.create(entityManager);

    const existingResource = await resourceRepository.findOneByUrl(resourceData.url);

    if (existingResource) {
      throw new Error(`Resource with url: ${resourceData.url} already exists.`);
    }

    const resource = await resourceRepository.createOne(resourceData);

    domainEventsDispatcher.addEvent(
      new ResourceCreatedEvent({
        id: resource.id,
      }),
    );

    return resource;
  }

  public async findResource(unitOfWork: PostgresUnitOfWork, resourceId: string): Promise<ResourceDto> {
    const entityManager = unitOfWork.getEntityManager();
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
    const entityManager = unitOfWork.getEntityManager();
    const domainEventsDispatcher = unitOfWork.getDomainEventsDispatcher();
    const resourceRepository = this.resourceRepositoryFactory.create(entityManager);

    const resource = await resourceRepository.updateOne(resourceId, { ...resourceData });

    domainEventsDispatcher.addEvent(
      new ResourceUpdatedEvent({
        id: resource.id,
      }),
    );

    return resource;
  }

  public async removeResource(unitOfWork: PostgresUnitOfWork, resourceId: string): Promise<void> {
    const entityManager = unitOfWork.getEntityManager();
    const domainEventsDispatcher = unitOfWork.getDomainEventsDispatcher();
    const resourceRepository = this.resourceRepositoryFactory.create(entityManager);

    await resourceRepository.removeOne(resourceId);

    domainEventsDispatcher.addEvent(
      new ResourceRemovedEvent({
        id: resourceId,
      }),
    );
  }
}
