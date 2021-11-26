import { Injectable } from '@nestjs/common';

import { PostgresUnitOfWork } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { UserResourceDto } from '../../dtos/userResourceDto';
import { UserResourceRepositoryFactory } from '../../repositories/userResource/userResourceRepository';
import { CreateUserResourceData, UpdateUserResourceData, FindUserResourceData } from './interfaces';

@Injectable()
export class UserResourceService {
  public constructor(private readonly userResourceRepositoryFactory: UserResourceRepositoryFactory) {}

  public async findUserResource(
    unitOfWork: PostgresUnitOfWork,
    findUserResourceData: FindUserResourceData,
  ): Promise<UserResourceDto> {
    const entityManager = unitOfWork.getEntityManager();
    const userResourceRepository = this.userResourceRepositoryFactory.create(entityManager);

    const userResource = await userResourceRepository.findOne({ ...findUserResourceData });

    if (!userResource) {
      throw new Error('User resource not found.');
    }

    return userResource;
  }

  public async createUserResource(
    unitOfWork: PostgresUnitOfWork,
    userResourceData: CreateUserResourceData,
  ): Promise<UserResourceDto> {
    const entityManager = unitOfWork.getEntityManager();
    const userResourceRepository = this.userResourceRepositoryFactory.create(entityManager);

    const userResource = await userResourceRepository.createOne(userResourceData);

    return userResource;
  }

  public async updateUserResource(
    unitOfWork: PostgresUnitOfWork,
    findUserResourceData: FindUserResourceData,
    userResourceData: UpdateUserResourceData,
  ): Promise<UserResourceDto> {
    const entityManager = unitOfWork.getEntityManager();
    const userResourceRepository = this.userResourceRepositoryFactory.create(entityManager);

    const foundUserResource = await userResourceRepository.findOne({ ...findUserResourceData });

    if (!foundUserResource) {
      throw new Error('User resource not found.');
    }

    const userResource = await userResourceRepository.updateOne(foundUserResource.id, { ...userResourceData });

    return userResource;
  }

  public async removeUserResource(
    unitOfWork: PostgresUnitOfWork,
    findUserResourceData: FindUserResourceData,
  ): Promise<void> {
    const entityManager = unitOfWork.getEntityManager();
    const userResourceRepository = this.userResourceRepositoryFactory.create(entityManager);

    const foundUserResource = await userResourceRepository.findOne({ ...findUserResourceData });

    if (!foundUserResource) {
      throw new Error('User resource not found.');
    }

    await userResourceRepository.removeOne(foundUserResource.id);
  }
}
