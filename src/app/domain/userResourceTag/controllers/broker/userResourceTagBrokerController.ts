import { DtoFactory } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';

import { UnitOfWorkFactory } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { UserResourceTagService } from '../../services/userResourceTag/userResourceTagService';
import { CreateUserResourceTagPayloadDto, CreateUserResourceTagResponseDto } from './dtos/createUserResourceTagDto';
import { RemoveUserResourceTagPayloadDto } from './dtos/removeUserResourceTagDto';

@Injectable()
export class UserResourceTagBrokerController {
  public constructor(
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    private readonly dtoFactory: DtoFactory,
    private readonly userResourceTagService: UserResourceTagService,
  ) {}

  public async createUserResourceTag(
    payload: CreateUserResourceTagPayloadDto,
  ): Promise<CreateUserResourceTagResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const userResourceTag = await unitOfWork.runInTransaction(async () => {
      const { userId, resourceId, tagId } = payload;

      const userResourceTag = await this.userResourceTagService.createUserResourceTag(unitOfWork, {
        userId,
        resourceId,
        tagId,
      });

      return userResourceTag;
    });

    // TODO: remove duplicate userId and resourceId
    return this.dtoFactory.create(CreateUserResourceTagResponseDto, {
      userResourceTag: {
        id: userResourceTag.id,
        createdAt: userResourceTag.createdAt,
        updatedAt: userResourceTag.updatedAt,
        userId: userResourceTag.userResourceId,
        resourceId: userResourceTag.userResourceId,
        tagId: userResourceTag.tagId,
      },
    });
  }

  public async removeUserResourceTag(payload: RemoveUserResourceTagPayloadDto): Promise<void> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    await unitOfWork.runInTransaction(async () => {
      const { resourceId } = payload;

      // TODO: replace resourceId with valid search query
      const userResourceTag = await this.userResourceTagService.removeUserResourceTag(unitOfWork, resourceId);

      return userResourceTag;
    });
  }
}
