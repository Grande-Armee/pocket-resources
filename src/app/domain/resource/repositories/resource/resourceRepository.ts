import { Injectable } from '@nestjs/common';
import { EntityRepository, EntityManager, FindConditions } from 'typeorm';

import { ResourceNotFoundError } from '@domain/resource/errors';
import { RepositoryFactory } from '@shared/database/types';

import { ResourceDto } from '../../dtos/resourceDto';
import { Resource } from '../../entities/resource';
import { ResourceMapper } from '../../mappers/resource/resourceMapper';

@EntityRepository()
export class ResourceRepository {
  public constructor(private readonly manager: EntityManager, private readonly resourceMapper: ResourceMapper) {}

  public async findOne(conditions: FindConditions<Resource>): Promise<ResourceDto | null> {
    const resource = await this.manager.findOne(Resource, conditions);

    if (!resource) {
      return null;
    }

    return this.resourceMapper.mapEntityToDto(resource);
  }

  public async findMany(conditions: FindConditions<Resource>): Promise<ResourceDto[]> {
    const resources = await this.manager.find(Resource, conditions);

    return resources.map((resource) => this.resourceMapper.mapEntityToDto(resource));
  }

  public async createOne(resourceData: Partial<Resource>): Promise<ResourceDto> {
    const resource = this.manager.create(Resource, { ...resourceData });

    const [savedResource] = await this.manager.save([resource]);

    return this.resourceMapper.mapEntityToDto(savedResource);
  }

  public async findOneById(id: string): Promise<ResourceDto | null> {
    return this.findOne({ id });
  }

  public async findOneByUrl(url: string): Promise<ResourceDto | null> {
    return this.findOne({ url });
  }

  public async updateOne(id: string, data: Partial<Resource>): Promise<ResourceDto> {
    const resource = await this.findOneById(id);

    if (!resource) {
      throw new ResourceNotFoundError({ id: id });
    }

    await this.manager.update(Resource, { id }, data);

    return this.findOneById(id) as Promise<ResourceDto>;
  }

  public async removeOne(id: string): Promise<void> {
    const resource = await this.findOneById(id);

    if (!resource) {
      throw new ResourceNotFoundError({ id: id });
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
