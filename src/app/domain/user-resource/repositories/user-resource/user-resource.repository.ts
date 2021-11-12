import { Injectable } from '@nestjs/common';
import { EntityRepository, EntityManager, FindConditions } from 'typeorm';

import { RepositoryFactory } from '../../../../shared/postgres/interfaces';
import { UserResourceDTO } from '../../dtos/user-resource.dto';
import { UserResource } from '../../entities/user-resource.entity';
import { UserResourceMapper } from '../../mappers/user-resource/user-resource.mapper';

@EntityRepository()
export class UserResourceRepository {
  public constructor(
    private readonly manager: EntityManager,
    private readonly userResourceMapper: UserResourceMapper,
  ) {}

  public async findOne(conditions: FindConditions<UserResource>): Promise<UserResourceDTO | null> {
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

    return this.userResourceMapper.mapEntityToDTO(entity);
  }

  public async findMany(conditions: FindConditions<UserResource>): Promise<UserResourceDTO[]> {
    const queryBuilder = this.manager.getRepository(UserResource).createQueryBuilder('userResource');

    const entities = await queryBuilder
      .leftJoinAndSelect('userResource.resource', 'resource')
      .leftJoinAndSelect('userResource.userResourceTags', 'userResourceTags')
      .leftJoinAndSelect('userResourceTags.tag', 'tag')
      .where(conditions)
      .getMany();

    return entities.map((entity) => this.userResourceMapper.mapEntityToDTO(entity));
  }

  public async findOneById(id: string): Promise<UserResourceDTO | null> {
    return this.findOne({ id });
  }

  public async createOne(resourceId: string): Promise<UserResourceDTO> {
    const userResource = this.manager.create(UserResource, {
      userId: 'daf76e08-83f7-4ed5-9664-742105bdaa24',
      resourceId,
    });

    const [savedUserResource] = await this.manager.save([userResource]);

    return this.userResourceMapper.mapEntityToDTO(savedUserResource);
  }
}

@Injectable()
export class UserResourceRepositoryFactory implements RepositoryFactory<UserResourceRepository> {
  public constructor(private readonly userResourceMapper: UserResourceMapper) {}

  public create(entityManager: EntityManager): UserResourceRepository {
    return new UserResourceRepository(entityManager, this.userResourceMapper);
  }
}
