import {
  LoggerService,
  UserResourceTagCreatedEvent,
  UserResourceTagNotFoundError,
  UserResourceTagRemovedEvent,
} from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';

import { UserResourceService } from '@domain/userResource/services/userResource/userResourceService';
import { PostgresUnitOfWork } from '@shared/unitOfWork/providers/unitOfWorkFactory';

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
      throw new UserResourceTagNotFoundError({ userId, resourceId, tagId });
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

    const { entityManager, integrationEventsStore } = unitOfWork;
    const userResourceTagRepository = this.userResourceTagRepositoryFactory.create(entityManager);

    const { userId, resourceId, tagId } = userResourceTagData;

    const userResource = await this.userResourceService.findUserResource(unitOfWork, { userId, resourceId });

    const userResourceTag = await userResourceTagRepository.createOne({
      userResourceId: userResource.id,
      tagId,
    });

    integrationEventsStore.addEvent(
      new UserResourceTagCreatedEvent({
        id: userResourceTag.id,
        createdAt: userResourceTag.createdAt,
        updatedAt: userResourceTag.updatedAt,
        userResourceId: userResourceTag.userResourceId,
        tagId: userResourceTag.tagId,
      }),
    );

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

    const { entityManager, integrationEventsStore } = unitOfWork;
    const userResourceTagRepository = this.userResourceTagRepositoryFactory.create(entityManager);

    const { userId, resourceId, tagId } = userResourceTagData;

    const userResourceTag = await userResourceTagRepository.findOneByIds(userId, resourceId, tagId);

    if (!userResourceTag) {
      throw new UserResourceTagNotFoundError({ userId, resourceId, tagId });
    }

    integrationEventsStore.addEvent(
      new UserResourceTagRemovedEvent({
        id: userResourceTag.id,
      }),
    );

    this.logger.info('User resource tag removed.', { userResourceTagId: userResourceTag.id });

    await userResourceTagRepository.removeOne(userResourceTag.id);
  }
}
