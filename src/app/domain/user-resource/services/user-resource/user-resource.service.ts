import { Injectable } from '@nestjs/common';

import { UnitOfWork } from '../../../../shared/unit-of-work/providers/unit-of-work-factory';
import { UserResourceDTO } from '../../dtos/user-resource.dto';
import { UserResourceRepositoryFactory } from '../../repositories/user-resource/user-resource.repository';

@Injectable()
export class UserResourceService {
  public constructor(private readonly userResourceRepositoryFactory: UserResourceRepositoryFactory) {}

  public async findUserResource(unitOfWork: UnitOfWork, userResourceId: string): Promise<UserResourceDTO> {
    const entityManager = unitOfWork.getEntityManager();
    const userResourceRepository = this.userResourceRepositoryFactory.create(entityManager);

    const userResource = await userResourceRepository.findOneById(userResourceId);

    if (!userResource) {
      throw new Error('Tag not found.');
    }

    return userResource;
  }

  public async createUserResource(unitOfWork: UnitOfWork): Promise<UserResourceDTO> {
    const entityManager = unitOfWork.getEntityManager();
    const userResourceRepository = this.userResourceRepositoryFactory.create(entityManager);

    const userResource = await userResourceRepository.createOne('');

    return userResource;
  }
}
