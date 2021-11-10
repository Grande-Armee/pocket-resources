import { Injectable } from '@nestjs/common';
import { EntityRepository, EntityManager } from 'typeorm';

import { RepositoryFactory } from '../../../../shared/postgres/interfaces';
import { ResourceDTO } from '../../dtos/resource.dto';
import { Resource } from '../../entities/resource.entity';
import { ResourceMapper } from '../../mappers/resource/resource.mapper';

@EntityRepository()
export class ResourceRepository {
  public constructor(private readonly manager: EntityManager, private readonly resourceMapper: ResourceMapper) {}

  public async findOneById(id: string): Promise<ResourceDTO | null> {
    const resource = await this.manager.findOne(Resource, { id });

    if (!resource) {
      return null;
    }

    return this.resourceMapper.mapEntityToDTO(resource);
  }

  public async createOne(): Promise<ResourceDTO> {
    // TODO: remove hardcoded id
    const resource = this.manager.create(Resource, {
      id: 'ef492cef-c478-4974-8555-97adadcc5c15',
      title: 'asd',
      content: 'asd',
      url: 'asd',
      thumbnailUrl: 'asd',
    });

    const [savedResource] = await this.manager.save([resource]);

    return this.resourceMapper.mapEntityToDTO(savedResource);
  }
}

@Injectable()
export class ResourceRepositoryFactory implements RepositoryFactory<ResourceRepository> {
  public constructor(private readonly resourceMapper: ResourceMapper) {}

  public create(entityManager: EntityManager): ResourceRepository {
    return new ResourceRepository(entityManager, this.resourceMapper);
  }
}
