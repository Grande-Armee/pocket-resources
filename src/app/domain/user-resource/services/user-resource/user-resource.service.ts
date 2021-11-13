import { Injectable } from '@nestjs/common';

import { UnitOfWork } from '../../../../shared/unit-of-work/providers/unit-of-work-factory';
import { UserResourceDTO } from '../../dtos/user-resource.dto';
import { UserResourceRepositoryFactory } from '../../repositories/user-resource/user-resource.repository';
import { CreateUserResourceData } from './interfaces/create-user-resource-data.interface';
import { UpdateUserResourceData } from './interfaces/update-user-resource-data.interface';

@Injectable()
export class UserResourceService {
  public constructor(private readonly userResourceRepositoryFactory: UserResourceRepositoryFactory) {}

  public async findUserResource(unitOfWork: UnitOfWork, userResourceId: string): Promise<UserResourceDTO> {
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
  ): Promise<UserResourceDTO> {
    const entityManager = unitOfWork.getEntityManager();
    const userResourceRepository = this.userResourceRepositoryFactory.create(entityManager);

    const userResource = await userResourceRepository.createOne(userResourceData);

    return userResource;
  }

  public async updateUserResource(
    unitOfWork: UnitOfWork,
    userResourceId: string,
    userResourceData: UpdateUserResourceData,
  ): Promise<UserResourceDTO> {
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
