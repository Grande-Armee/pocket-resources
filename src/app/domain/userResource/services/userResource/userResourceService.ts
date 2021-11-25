import { Injectable } from '@nestjs/common';

import { UnitOfWork } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { UserResourceDto } from '../../dtos/userResourceDto';
import { UserResourceRepositoryFactory } from '../../repositories/userResource/userResourceRepository';
import { CreateUserResourceData, UpdateUserResourceData } from './interfaces';

@Injectable()
export class UserResourceService {
  public constructor(private readonly userResourceRepositoryFactory: UserResourceRepositoryFactory) {}

  public async findUserResource(unitOfWork: UnitOfWork, userResourceId: string): Promise<UserResourceDto> {
    const entityManager = unitOfWork.getEntityManager();
    const userResourceRepository = this.userResourceRepositoryFactory.create(entityManager);

    const userResource = await userResourceRepository.findOneById(userResourceId);

    if (!userResource) {
      throw new Error('User resource not found.');
    }

    return userResource;
  }

  public async createUserResource(
    unitOfWork: UnitOfWork,
    userResourceData: CreateUserResourceData,
  ): Promise<UserResourceDto> {
    const entityManager = unitOfWork.getEntityManager();
    const userResourceRepository = this.userResourceRepositoryFactory.create(entityManager);

    const userResource = await userResourceRepository.createOne(userResourceData);

    return userResource;
  }

  public async updateUserResource(
    unitOfWork: UnitOfWork,
    userResourceId: string,
    userResourceData: UpdateUserResourceData,
  ): Promise<UserResourceDto> {
    const entityManager = unitOfWork.getEntityManager();
    const userResourceRepository = this.userResourceRepositoryFactory.create(entityManager);

    const userResource = await userResourceRepository.updateOne(userResourceId, { ...userResourceData });

    return userResource;
  }

  public async removeUserResource(unitOfWork: UnitOfWork, userResourceId: string): Promise<void> {
    const entityManager = unitOfWork.getEntityManager();
    const userResourceRepository = this.userResourceRepositoryFactory.create(entityManager);

    await userResourceRepository.removeOne(userResourceId);
  }
}
