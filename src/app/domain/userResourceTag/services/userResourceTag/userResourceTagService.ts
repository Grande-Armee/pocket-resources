import { LoggerService } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';

import { PostgresUnitOfWork } from '@shared/unitOfWork/providers/unitOfWorkFactory';
import { UserResourceService } from '@src/app/domain/userResource/services/userResource/userResourceService';

import { UserResourceTagDto } from '../../dtos/userResourceTagDto';
import { UserResourceTagRepositoryFactory } from '../../repositories/userResourceTag/userResourceTagRepository';
import { CreateUserResourceTagData, FindUserResourceTagData } from './types';

@Injectable()
export class UserResourceTagService {
  public constructor(
    private readonly userResourceTagRepositoryFactory: UserResourceTagRepositoryFactory,
    private readonly logger: LoggerService,
    private readonly userResourceService: UserResourceService,
  ) {}

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
    this.logger.debug('Creating user resource tag...', {
      userId: userResourceTagData.userId,
      resourceId: userResourceTagData.resourceId,
      tagId: userResourceTagData.tagId,
    });

    const { entityManager } = unitOfWork;
    const userResourceTagRepository = this.userResourceTagRepositoryFactory.create(entityManager);

    const { userId, resourceId, tagId } = userResourceTagData;

    const userResource = await this.userResourceService.findUserResource(unitOfWork, { userId, resourceId });

    const userResourceTag = await userResourceTagRepository.createOne({
      userResourceId: userResource.id,
      tagId,
    });

    this.logger.info('User resource tag created.', { userResourceTagId: userResourceTag.id });

    return userResourceTag;
  }

  public async removeUserResourceTag(
    unitOfWork: PostgresUnitOfWork,
    userResourceTagData: FindUserResourceTagData,
  ): Promise<void> {
    this.logger.debug('Removing user resource tag...', {
      userId: userResourceTagData.userId,
      resourceId: userResourceTagData.resourceId,
      tagId: userResourceTagData.tagId,
    });

    const { entityManager } = unitOfWork;
    const userResourceTagRepository = this.userResourceTagRepositoryFactory.create(entityManager);

    const { userId, resourceId, tagId } = userResourceTagData;

    const userResourceTag = await userResourceTagRepository.findOneByIds(userId, resourceId, tagId);

    if (!userResourceTag) {
      throw new Error('User resource tag not found.');
    }

    this.logger.info('User resource tag removed.', { userResourceTagId: userResourceTag.id });

    await userResourceTagRepository.removeOne(userResourceTag.id);
  }
}
