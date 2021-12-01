import { DtoFactory } from '@grande-armee/pocket-common';

import { BrokerController } from '@shared/broker/decorators/brokerController';
import { RpcRoute } from '@shared/broker/decorators/rpcRoute';
import {
  CreateUserResourcePayloadDto,
  CreateUserResourceResponseDto,
} from '@shared/broker/domain/userResource/requests/createUserResource';
import {
  FindUserResourcePayloadDto,
  FindUserResourceResponseDto,
} from '@shared/broker/domain/userResource/requests/findUserResource';
import { RemoveUserResourcePayloadDto } from '@shared/broker/domain/userResource/requests/removeUserResource';
import {
  UpdateUserResourcePayloadDto,
  UpdateUserResourceResponseDto,
} from '@shared/broker/domain/userResource/requests/updateUserResource';
import { UserResourceRoutingKey } from '@shared/broker/domain/userResource/userResourceRoutingKey';
import { BrokerService } from '@shared/broker/services/broker/brokerService';
import { BrokerMessage } from '@shared/broker/types';
import { UnitOfWorkFactory } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { UserResourceService } from '../../../services/userResource/userResourceService';

@BrokerController()
export class UserResourceBrokerController {
  public constructor(
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    private readonly brokerService: BrokerService,
    private readonly dtoFactory: DtoFactory,
    private readonly userResourceService: UserResourceService,
  ) {}

  @RpcRoute(UserResourceRoutingKey.createUserResource)
  public async createUserResource(_: unknown, message: BrokerMessage): Promise<CreateUserResourceResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(CreateUserResourcePayloadDto, message);

    const userResource = await unitOfWork.runInTransaction(async () => {
      const { userId, resourceId } = data.payload;

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

  @RpcRoute(UserResourceRoutingKey.findUserResource)
  public async findUserResource(_: unknown, message: BrokerMessage): Promise<FindUserResourceResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(FindUserResourcePayloadDto, message);

    const userResource = await unitOfWork.runInTransaction(async () => {
      const { userId, resourceId } = data.payload;

      const userResource = await this.userResourceService.findUserResource(unitOfWork, { userId, resourceId });

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

  @RpcRoute(UserResourceRoutingKey.updateUserResource)
  public async updateUserResource(_: unknown, message: BrokerMessage): Promise<UpdateUserResourceResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(UpdateUserResourcePayloadDto, message);

    const userResource = await unitOfWork.runInTransaction(async () => {
      const { userId, resourceId, status, isFavorite, rating } = data.payload;

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

  @RpcRoute(UserResourceRoutingKey.removeUserResource)
  public async removeUserResource(_: unknown, message: BrokerMessage): Promise<void> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(RemoveUserResourcePayloadDto, message);

    await unitOfWork.runInTransaction(async () => {
      const { userId, resourceId } = data.payload;

      await this.userResourceService.removeUserResource(unitOfWork, { userId, resourceId });
    });
  }
}
