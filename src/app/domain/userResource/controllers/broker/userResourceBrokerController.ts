import { DtoFactory } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';

import { UnitOfWorkFactory } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { UserResourceService } from '../../services/userResource/userResourceService';
import { CreateUserResourcePayloadDto, CreateUserResourceResponseDto } from './dtos/createUserResourceDto';
import { FindUserResourcePayloadDto, FindUserResourceResponseDto } from './dtos/findUserResourceDto';
import { RemoveUserResourcePayloadDto } from './dtos/removeUserResourceDto';
import { UpdateUserResourcePayloadDto, UpdateUserResourceResponseDto } from './dtos/updateUserResourceDto';

@Injectable()
export class UserResourceBrokerController {
  public constructor(
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    private readonly dtoFactory: DtoFactory,
    private readonly userResourceService: UserResourceService,
  ) {}

  public async createUserResource(payload: CreateUserResourcePayloadDto): Promise<CreateUserResourceResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const userResource = await unitOfWork.runInTransaction(async () => {
      const { userId, resourceId } = payload;

      const userResource = await this.userResourceService.createUserResource(unitOfWork, {
        userId,
        resourceId,
      });

      return userResource;
    });

    return this.dtoFactory.create(CreateUserResourceResponseDto, {
      userResource: {
        id: userResource.id,
        createdAt: userResource.createdAt,
        updatedAt: userResource.updatedAt,
        status: userResource.status,
        isFavorite: userResource.isFavorite,
        rating: userResource.rating,
        resource: userResource.resource,
        resourceId: userResource.resourceId,
        userId: userResource.userId,
        tags: userResource.tags,
      },
    });
  }

  public async findUserResource(payload: FindUserResourcePayloadDto): Promise<FindUserResourceResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const userResource = await unitOfWork.runInTransaction(async () => {
      const userResource = await this.userResourceService.findUserResource(unitOfWork, { ...payload });

      return userResource;
    });

    return this.dtoFactory.create(CreateUserResourceResponseDto, {
      userResource: {
        id: userResource.id,
        createdAt: userResource.createdAt,
        updatedAt: userResource.updatedAt,
        status: userResource.status,
        isFavorite: userResource.isFavorite,
        rating: userResource.rating,
        resource: userResource.resource,
        resourceId: userResource.resourceId,
        userId: userResource.userId,
        tags: userResource.tags,
      },
    });
  }

  public async updateUserResource(payload: UpdateUserResourcePayloadDto): Promise<UpdateUserResourceResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const userResource = await unitOfWork.runInTransaction(async () => {
      const { userId, resourceId, status, isFavorite, rating } = payload;

      const userResource = await this.userResourceService.updateUserResource(
        unitOfWork,
        { userId, resourceId },
        {
          status,
          isFavorite,
          rating,
        },
      );

      return userResource;
    });

    return this.dtoFactory.create(CreateUserResourceResponseDto, {
      userResource: {
        id: userResource.id,
        createdAt: userResource.createdAt,
        updatedAt: userResource.updatedAt,
        status: userResource.status,
        isFavorite: userResource.isFavorite,
        rating: userResource.rating,
        resource: userResource.resource,
        resourceId: userResource.resourceId,
        userId: userResource.userId,
        tags: userResource.tags,
      },
    });
  }

  public async removeUserResource(payload: RemoveUserResourcePayloadDto): Promise<void> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    await unitOfWork.runInTransaction(async () => {
      const userResource = await this.userResourceService.removeUserResource(unitOfWork, { ...payload });

      return userResource;
    });
  }
}
