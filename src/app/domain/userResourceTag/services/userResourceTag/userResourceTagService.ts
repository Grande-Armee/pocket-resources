import { Injectable } from '@nestjs/common';

import { PostgresUnitOfWork } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { UserResourceTagDto } from '../../dtos/userResourceTagDto';
import { UserResourceTagRepositoryFactory } from '../../repositories/userResourceTag/userResourceTagRepository';
import { CreateUserResourceTagData } from './interfaces';

@Injectable()
export class UserResourceTagService {
  public constructor(private readonly userResourceTagRepositoryFactory: UserResourceTagRepositoryFactory) {}

  public async createUserResourceTag(
    unitOfWork: PostgresUnitOfWork,
    userResourceTagData: CreateUserResourceTagData,
  ): Promise<UserResourceTagDto> {
    const entityManager = unitOfWork.getEntityManager();
    const userResourceTagRepository = this.userResourceTagRepositoryFactory.create(entityManager);

    const userResourceTag = await userResourceTagRepository.createOne(userResourceTagData);

    return userResourceTag;
  }

  public async removeUserResourceTag(unitOfWork: PostgresUnitOfWork, userResourceTagId: string): Promise<void> {
    const entityManager = unitOfWork.getEntityManager();
    const userResourceTagRepository = this.userResourceTagRepositoryFactory.create(entityManager);

    await userResourceTagRepository.removeOne(userResourceTagId);
  }
}
