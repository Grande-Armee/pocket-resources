import { Injectable } from '@nestjs/common';

import { PostgresUnitOfWork } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { UserResourceTagDto } from '../../dtos/userResourceTagDto';
import { UserResourceTagRepositoryFactory } from '../../repositories/userResourceTag/userResourceTagRepository';
import { CreateUserResourceTagData, FindUserResourceTagData } from './interfaces';

@Injectable()
export class UserResourceTagService {
  public constructor(private readonly userResourceTagRepositoryFactory: UserResourceTagRepositoryFactory) {}

  public async findUserResourceTag(
    unitOfWork: PostgresUnitOfWork,
    userResourceTagData: FindUserResourceTagData,
  ): Promise<UserResourceTagDto> {
    const { entityManager } = unitOfWork;
    const userResourceTagRepository = this.userResourceTagRepositoryFactory.create(entityManager);

    const { userId, resourceId, tagId } = userResourceTagData;

    const userResourceTag = await userResourceTagRepository.findOneByIds(userId, resourceId, tagId);

    if (!userResourceTag) {
      throw new Error('User resource tag not found.');
    }

    return userResourceTag;
  }

  public async createUserResourceTag(
    unitOfWork: PostgresUnitOfWork,
    userResourceTagData: CreateUserResourceTagData,
  ): Promise<UserResourceTagDto> {
    const { entityManager } = unitOfWork;
    const userResourceTagRepository = this.userResourceTagRepositoryFactory.create(entityManager);

    const userResourceTag = await userResourceTagRepository.createOne(
      userResourceTagData.userId,
      userResourceTagData.resourceId,
      userResourceTagData.tagId,
    );

    return userResourceTag;
  }

  public async removeUserResourceTag(
    unitOfWork: PostgresUnitOfWork,
    userResourceTagData: FindUserResourceTagData,
  ): Promise<void> {
    const { entityManager } = unitOfWork;
    const userResourceTagRepository = this.userResourceTagRepositoryFactory.create(entityManager);

    const { userId, resourceId, tagId } = userResourceTagData;

    const userResourceTag = await userResourceTagRepository.findOneByIds(userId, resourceId, tagId);

    if (!userResourceTag) {
      throw new Error('User resource tag not found.');
    }

    await userResourceTagRepository.removeOne(userResourceTag.id);
  }
}
