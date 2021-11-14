import { Injectable } from '@nestjs/common';
import { EntityRepository, EntityManager, FindConditions } from 'typeorm';

import { RepositoryFactory } from '../../../../shared/postgres/interfaces';
import { ResourceDTO } from '../../dtos/resourceDTO';
import { Resource } from '../../entities/resource';
import { ResourceMapper } from '../../mappers/resource/resourceMapper';

@EntityRepository()
export class ResourceRepository {
  public constructor(private readonly manager: EntityManager, private readonly resourceMapper: ResourceMapper) {}

  public async findOne(conditions: FindConditions<Resource>): Promise<ResourceDTO | null> {
    const resource = await this.manager.findOne(Resource, conditions);

    if (!resource) {
      return null;
    }

    return this.resourceMapper.mapEntityToDTO(resource);
  }

  public async findMany(conditions: FindConditions<Resource>): Promise<ResourceDTO[]> {
    const resources = await this.manager.find(Resource, conditions);

    return resources.map((resource) => this.resourceMapper.mapEntityToDTO(resource));
  }

  public async createOne(resourceData: Partial<Resource>): Promise<ResourceDTO> {
    const resource = this.manager.create(Resource, { ...resourceData });

    const [savedResource] = await this.manager.save([resource]);

    return this.resourceMapper.mapEntityToDTO(savedResource);
  }

  public async findOneById(id: string): Promise<ResourceDTO | null> {
    return this.findOne({ id });
  }

  public async findOneByUrl(url: string): Promise<ResourceDTO | null> {
    return this.findOne({ url });
  }

  public async updateOne(id: string, data: Partial<Resource>): Promise<ResourceDTO> {
    const resource = await this.findOneById(id);

    if (!resource) {
      throw new Error('Resource not found');
    }

    await this.manager.update(Resource, { id }, data);

    return this.findOneById(id) as Promise<ResourceDTO>;
  }

  public async removeOne(id: string): Promise<void> {
    const resource = await this.findOneById(id);

    if (!resource) {
      throw new Error('Resource not found');
    }

    await this.manager.delete(Resource, { id });
  }
}

@Injectable()
export class ResourceRepositoryFactory implements RepositoryFactory<ResourceRepository> {
  public constructor(private readonly resourceMapper: ResourceMapper) {}

  public create(entityManager: EntityManager): ResourceRepository {
    return new ResourceRepository(entityManager, this.resourceMapper);
  }
}
