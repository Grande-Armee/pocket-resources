import { Injectable } from '@nestjs/common';

import { UnitOfWork } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { UserResourceTagDTO } from '../../dtos/userResourceTagDTO';
import { UserResourceTagRepositoryFactory } from '../../repositories/userResourceTag/userResourceTagRepository';
import { CreateUserResourceTagData } from './interfaces';

@Injectable()
export class UserResourceTagService {
  public constructor(private readonly userResourceTagRepositoryFactory: UserResourceTagRepositoryFactory) {}

  public async findUserResourceTag(unitOfWork: UnitOfWork, userResourceTagId: string): Promise<UserResourceTagDTO> {
    const entityManager = unitOfWork.getEntityManager();
    const userResourceTagRepository = this.userResourceTagRepositoryFactory.create(entityManager);

    const userResourceTag = await userResourceTagRepository.findOneById(userResourceTagId);

    if (!userResourceTag) {
      throw new Error('Tag not found.');
    }

    return userResourceTag;
  }

  public async createUserResourceTag(
    unitOfWork: UnitOfWork,
    userResourceTagData: CreateUserResourceTagData,
  ): Promise<UserResourceTagDTO> {
    const entityManager = unitOfWork.getEntityManager();
    const userResourceTagRepository = this.userResourceTagRepositoryFactory.create(entityManager);

    const userResourceTag = await userResourceTagRepository.createOne(userResourceTagData);

    return userResourceTag;
  }

  public async removeUserResourceTag(unitOfWork: UnitOfWork, userResourceTagId: string): Promise<void> {
    const entityManager = unitOfWork.getEntityManager();
    const userResourceTagRepository = this.userResourceTagRepositoryFactory.create(entityManager);

    await userResourceTagRepository.removeOne(userResourceTagId);
  }
}
