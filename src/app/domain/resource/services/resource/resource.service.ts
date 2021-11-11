import { Injectable } from '@nestjs/common';

import { UnitOfWork } from '../../../../shared/unit-of-work/providers/unit-of-work-factory';
import { ResourceCreatedEvent } from '../../domain-events/resource-created.event';
import { ResourceUpdatedEvent } from '../../domain-events/resource-updated.event';
import { ResourceDTO } from '../../dtos/resource.dto';
import { ResourceRepositoryFactory } from '../../repositories/resource/resource.repository';
import { CreateResourceData } from './interfaces/create-resource-data.interface';
import { UpdateResourceData } from './interfaces/update-resource-data.interface';

@Injectable()
export class ResourceService {
  public constructor(private readonly resourceRepositoryFactory: ResourceRepositoryFactory) {}

  public async createResource(unitOfWork: UnitOfWork, resourceData: CreateResourceData): Promise<ResourceDTO> {
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

  public async findResource(unitOfWork: UnitOfWork, resourceId: string): Promise<ResourceDTO> {
    const entityManager = unitOfWork.getEntityManager();
    const resourceRepository = this.resourceRepositoryFactory.create(entityManager);

    const resource = await resourceRepository.findOneById(resourceId);

    if (!resource) {
      throw new Error('Resource not found.');
    }

    return resource;
  }

  public async updateResource(
    unitOfWork: UnitOfWork,
    resourceId: string,
    resourceData: UpdateResourceData,
  ): Promise<ResourceDTO> {
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
}
