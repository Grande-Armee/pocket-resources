import { Injectable } from '@nestjs/common';

import { UnitOfWork } from '../../../../shared/unit-of-work/providers/unit-of-work-factory';
import { UserResourceTagDTO } from '../../dtos/user-resource-tag.dto';
import { UserResourceTagRepositoryFactory } from '../../repositories/user-resource-tag/user-resource-tag.repository';

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

  public async createUserResourceTag(unitOfWork: UnitOfWork): Promise<UserResourceTagDTO> {
    const entityManager = unitOfWork.getEntityManager();
    const userResourceTagRepository = this.userResourceTagRepositoryFactory.create(entityManager);

    const userResourceTag = await userResourceTagRepository.createOne({});

    return userResourceTag;
  }
}
