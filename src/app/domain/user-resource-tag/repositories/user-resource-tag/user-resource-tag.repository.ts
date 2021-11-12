import { Injectable } from '@nestjs/common';
import { EntityRepository, EntityManager, FindConditions } from 'typeorm';

import { RepositoryFactory } from '../../../../shared/postgres/interfaces';
import { UserResourceTagDTO } from '../../dtos/user-resource-tag.dto';
import { UserResourceTag } from '../../entities/user-resource-tag.entity';
import { UserResourceTagMapper } from '../../mappers/user-resource-tag/user-resource-tag.mapper';

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

  public async createOne(data: Partial<UserResourceTag>): Promise<UserResourceTagDTO> {
    const userResourceTag = this.manager.create(UserResourceTag, { ...data });

    const [savedUserResourceTag] = await this.manager.save([userResourceTag]);

    return this.userResourceTagMapper.mapEntityToDTO(savedUserResourceTag);
  }
}

@Injectable()
export class UserResourceTagRepositoryFactory implements RepositoryFactory<UserResourceTagRepository> {
  public constructor(private readonly userResourceTagMapper: UserResourceTagMapper) {}

  public create(entityManager: EntityManager): UserResourceTagRepository {
    return new UserResourceTagRepository(entityManager, this.userResourceTagMapper);
  }
}
