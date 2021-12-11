import { Injectable } from '@nestjs/common';
import { EntityRepository, EntityManager, FindConditions } from 'typeorm';

import { UserResourceNotFoundError } from '@domain/userResource/errors';
import { RepositoryFactory } from '@shared/database/types';

import { UserResourceDto } from '../../dtos/userResourceDto';
import { UserResource } from '../../entities/userResource';
import { UserResourceMapper } from '../../mappers/userResource/userResourceMapper';

@EntityRepository()
export class UserResourceRepository {
  public constructor(
    private readonly manager: EntityManager,
    private readonly userResourceMapper: UserResourceMapper,
  ) {}

  public async findOne(conditions: FindConditions<UserResource>): Promise<UserResourceDto | null> {
    const queryBuilder = this.manager.getRepository(UserResource).createQueryBuilder('userResource');

    const entity = await queryBuilder
      .leftJoinAndSelect('userResource.resource', 'resource')
      .leftJoinAndSelect('userResource.userResourceTags', 'userResourceTags')
      .leftJoinAndSelect('userResourceTags.tag', 'tag')
      .where(conditions)
      .getOne();

    if (!entity) {
      return null;
    }

    return this.userResourceMapper.mapEntityToDto(entity);
  }

  public async findMany(conditions: FindConditions<UserResource>): Promise<UserResourceDto[]> {
    const queryBuilder = this.manager.getRepository(UserResource).createQueryBuilder('userResource');

    const entities = await queryBuilder
      .leftJoinAndSelect('userResource.resource', 'resource')
      .leftJoinAndSelect('userResource.userResourceTags', 'userResourceTags')
      .leftJoinAndSelect('userResourceTags.tag', 'tag')
      .where(conditions)
      .getMany();

    return entities.map((entity) => this.userResourceMapper.mapEntityToDto(entity));
  }

  public async findOneById(id: string): Promise<UserResourceDto | null> {
    return this.findOne({ id });
  }

  public async createOne(data: Partial<UserResource>): Promise<UserResourceDto> {
    const userResource = this.manager.create(UserResource, {
      ...data,
    });

    const [savedUserResource] = await this.manager.save([userResource]);

    return this.userResourceMapper.mapEntityToDto(savedUserResource);
  }

  public async updateOne(id: string, data: Partial<UserResource>): Promise<UserResourceDto> {
    const userResource = await this.findOneById(id);

    if (!userResource) {
      throw new UserResourceNotFoundError({ id });
    }

    await this.manager.update(UserResource, { id }, data);

    return this.findOneById(id) as Promise<UserResourceDto>;
  }

  public async removeOne(id: string): Promise<void> {
    const userResource = await this.findOneById(id);

    if (!userResource) {
      throw new UserResourceNotFoundError({ id });
    }

    await this.manager.delete(UserResource, { id });
  }
}

@Injectable()
export class UserResourceRepositoryFactory implements RepositoryFactory<UserResourceRepository> {
  public constructor(private readonly userResourceMapper: UserResourceMapper) {}

  public create(entityManager: EntityManager): UserResourceRepository {
    return new UserResourceRepository(entityManager, this.userResourceMapper);
  }
}
