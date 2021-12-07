import { Injectable } from '@nestjs/common';
import { EntityRepository, EntityManager, FindConditions } from 'typeorm';

import { UserResource } from '@domain/userResource/entities/userResource';
import { RepositoryFactory } from '@shared/postgres/interfaces';

import { UserResourceTagDto } from '../../dtos/userResourceTagDto';
import { UserResourceTag } from '../../entities/userResourceTag';
import { UserResourceTagMapper } from '../../mappers/userResourceTag/userResourceTagMapper';

@EntityRepository()
export class UserResourceTagRepository {
  public constructor(
    private readonly manager: EntityManager,
    private readonly userResourceTagMapper: UserResourceTagMapper,
  ) {}

  public async findOneByIds(userId: string, resourceId: string, tagId: string): Promise<UserResourceTagDto | null> {
    const userResource = await this.manager.findOne(UserResource, { userId, resourceId });

    if (!userResource) {
      return null;
    }

    const userResourceTag = await this.manager.findOne(UserResourceTag, { userResourceId: userResource.id, tagId });

    if (!userResourceTag) {
      return null;
    }

    return this.userResourceTagMapper.mapEntityToDto(userResourceTag);
  }

  public async findOne(conditions: FindConditions<UserResourceTag>): Promise<UserResourceTagDto | null> {
    const userResourceTag = await this.manager.findOne(UserResourceTag, conditions);

    if (!userResourceTag) {
      return null;
    }

    return this.userResourceTagMapper.mapEntityToDto(userResourceTag);
  }

  public async findOneById(id: string): Promise<UserResourceTagDto | null> {
    return this.findOne({ id });
  }

  public async findMany(conditions: FindConditions<UserResourceTag>): Promise<UserResourceTagDto[]> {
    const userResourceTags = await this.manager.find(UserResourceTag, conditions);

    return userResourceTags.map((userResourceTag) => this.userResourceTagMapper.mapEntityToDto(userResourceTag));
  }

  public async createOne(userId: string, resourceId: string, tagId: string): Promise<UserResourceTagDto> {
    const userResource = await this.manager.findOne(UserResource, { userId, resourceId });

    if (!userResource) {
      throw new Error('User resource not found');
    }

    const userResourceTag = this.manager.create(UserResourceTag, { userResourceId: userResource.id, tagId });

    const [savedUserResourceTag] = await this.manager.save([userResourceTag]);

    return this.userResourceTagMapper.mapEntityToDto(savedUserResourceTag);
  }

  public async removeOne(id: string): Promise<void> {
    const userResourceTag = await this.findOneById(id);

    if (!userResourceTag) {
      throw new Error('User resource tag not found');
    }

    await this.manager.delete(UserResourceTag, { id });
  }
}

@Injectable()
export class UserResourceTagRepositoryFactory implements RepositoryFactory<UserResourceTagRepository> {
  public constructor(private readonly userResourceTagMapper: UserResourceTagMapper) {}

  public create(entityManager: EntityManager): UserResourceTagRepository {
    return new UserResourceTagRepository(entityManager, this.userResourceTagMapper);
  }
}
