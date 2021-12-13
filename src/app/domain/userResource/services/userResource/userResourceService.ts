import { LoggerService } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';

import { UserResourceNotFoundError } from '@domain/userResource/errors';
import {
  UserResourceCreatedEvent,
  UserResourceRemovedEvent,
  UserResourceUpdatedEvent,
} from '@domain/userResource/integrationEvents';
import { PostgresUnitOfWork } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { UserResourceDto } from '../../dtos/userResourceDto';
import { UserResourceRepositoryFactory } from '../../repositories/userResource/userResourceRepository';
import { CreateUserResourceData, UpdateUserResourceData, FindUserResourceData } from './types';

@Injectable()
export class UserResourceService {
  public constructor(
    private readonly userResourceRepositoryFactory: UserResourceRepositoryFactory,
    private readonly logger: LoggerService,
  ) {}

  public async findUserResource(
    unitOfWork: PostgresUnitOfWork,
    findUserResourceData: FindUserResourceData,
  ): Promise<UserResourceDto> {
    const { entityManager } = unitOfWork;
    const userResourceRepository = this.userResourceRepositoryFactory.create(entityManager);

    const userResource = await userResourceRepository.findOne({ ...findUserResourceData });

    if (!userResource) {
      throw new UserResourceNotFoundError({
        userId: findUserResourceData.userId,
        resourceId: findUserResourceData.resourceId,
      });
    }

    return userResource;
  }

  public async createUserResource(
    unitOfWork: PostgresUnitOfWork,
    userResourceData: CreateUserResourceData,
  ): Promise<UserResourceDto> {
    this.logger.debug('Creating user resource...', {
      userId: userResourceData.userId,
      resourceId: userResourceData.resourceId,
    });

    const { entityManager, integrationEventsStore } = unitOfWork;
    const userResourceRepository = this.userResourceRepositoryFactory.create(entityManager);

    const userResource = await userResourceRepository.createOne(userResourceData);

    integrationEventsStore.addEvent(
      new UserResourceCreatedEvent({
        id: userResource.id,
        createdAt: userResource.createdAt,
        updatedAt: userResource.updatedAt,
        status: userResource.status,
        isFavorite: userResource.isFavorite,
        rating: userResource.rating,
        resourceId: userResource.resourceId,
        userId: userResource.userId,
      }),
    );

    this.logger.info('User resource created.', { userResourceId: userResource.id });

    return userResource;
  }

  public async updateUserResource(
    unitOfWork: PostgresUnitOfWork,
    findUserResourceData: FindUserResourceData,
    userResourceData: UpdateUserResourceData,
  ): Promise<UserResourceDto> {
    this.logger.debug('Updating user resource...', {
      userId: findUserResourceData.userId,
      resourceId: findUserResourceData.resourceId,
    });

    const { entityManager, integrationEventsStore } = unitOfWork;
    const userResourceRepository = this.userResourceRepositoryFactory.create(entityManager);

    const foundUserResource = await userResourceRepository.findOne({ ...findUserResourceData });

    if (!foundUserResource) {
      throw new UserResourceNotFoundError({
        userId: findUserResourceData.userId,
        resourceId: findUserResourceData.resourceId,
      });
    }

    const userResource = await userResourceRepository.updateOne(foundUserResource.id, { ...userResourceData });

    integrationEventsStore.addEvent(
      new UserResourceUpdatedEvent({
        id: userResource.id,
        createdAt: userResource.createdAt,
        updatedAt: userResource.updatedAt,
        status: userResource.status,
        isFavorite: userResource.isFavorite,
        rating: userResource.rating,
        resourceId: userResource.resourceId,
        userId: userResource.userId,
      }),
    );

    this.logger.info('User resource updated.', { userResourceId: userResource.id });

    return userResource;
  }

  public async removeUserResource(
    unitOfWork: PostgresUnitOfWork,
    findUserResourceData: FindUserResourceData,
  ): Promise<void> {
    this.logger.debug('Removing user resource...', {
      userId: findUserResourceData.userId,
      resourceId: findUserResourceData.resourceId,
    });

    const { entityManager, integrationEventsStore } = unitOfWork;
    const userResourceRepository = this.userResourceRepositoryFactory.create(entityManager);

    const foundUserResource = await userResourceRepository.findOne({ ...findUserResourceData });

    if (!foundUserResource) {
      throw new UserResourceNotFoundError({
        userId: findUserResourceData.userId,
        resourceId: findUserResourceData.resourceId,
      });
    }

    integrationEventsStore.addEvent(
      new UserResourceRemovedEvent({
        id: foundUserResource.id,
      }),
    );

    this.logger.info('User resource removed.', { userResourceId: foundUserResource.id });

    await userResourceRepository.removeOne(foundUserResource.id);
  }
}
