import { Injectable } from '@nestjs/common';
import { EntityRepository, EntityManager, FindConditions } from 'typeorm';

import { RepositoryFactory } from '@shared/postgres/interfaces';

import { UserResourceTagDTO } from '../../dtos/userResourceTagDTO';
import { UserResourceTag } from '../../entities/userResourceTag';
import { UserResourceTagMapper } from '../../mappers/userResourceTag/userResourceTagMapper';

@EntityRepository()
export class UserResourceTagRepository {
  public constructor(
    private readonly manager: EntityManager,
    private readonly userResourceTagMapper: UserResourceTagMapper,
  ) {}

  public async findOne(conditions: FindConditions<UserResourceTag>): Promise<UserResourceTagDTO | null> {
    const userResourceTag = await this.manager.findOne(UserResourceTag, conditions);

    if (!userResourceTag) {
      return null;
    }

    return this.userResourceTagMapper.mapEntityToDTO(userResourceTag);
  }

  public async findOneById(id: string): Promise<UserResourceTagDTO | null> {
    return this.findOne({ id });
  }

  public async findMany(conditions: FindConditions<UserResourceTag>): Promise<UserResourceTagDTO[]> {
    const userResourceTags = await this.manager.find(UserResourceTag, conditions);

    return userResourceTags.map((userResourceTag) => this.userResourceTagMapper.mapEntityToDTO(userResourceTag));
  }

  public async createOne(data: Partial<UserResourceTag>): Promise<UserResourceTagDTO> {
    const userResourceTag = this.manager.create(UserResourceTag, { ...data });

    const [savedUserResourceTag] = await this.manager.save([userResourceTag]);

    return this.userResourceTagMapper.mapEntityToDTO(savedUserResourceTag);
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