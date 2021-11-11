import { Injectable } from '@nestjs/common';

import { UnitOfWork } from '../../../../shared/unit-of-work/providers/unit-of-work-factory';
import { ResourceCreatedEvent } from '../../domain-events/resource-created.event';
import { ResourceDTO } from '../../dtos/resource.dto';
import { ResourceRepositoryFactory } from '../../repositories/resource/resource.repository';
import { CreateResourceData } from './interfaces/create-resource-data.interface';

@Injectable()
export class ResourceService {
  public constructor(private readonly resourceRepositoryFactory: ResourceRepositoryFactory) {}

  public async createResource(unitOfWork: UnitOfWork, createResourceData: CreateResourceData): Promise<ResourceDTO> {
    const entityManager = unitOfWork.getEntityManager();
    const domainEventsDispatcher = unitOfWork.getDomainEventsDispatcher();
    const resourceRepository = this.resourceRepositoryFactory.create(entityManager);

    const existingResource = await resourceRepository.findOneByUrl(createResourceData.url);

    if (existingResource) {
      throw new Error(`Resource with url: ${createResourceData.url} already exists.`);
    }

    const resource = await resourceRepository.createOne(createResourceData);

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
}
