import {
  BrokerController,
  BrokerService,
  DtoFactory,
  RpcRoute,
  UserResourceRoutingKey,
  BrokerMessage,
  CreateUserResourceResponseDto,
  CreateUserResourcePayloadDto,
  FindUserResourceResponseDto,
  FindUserResourcePayloadDto,
  UpdateUserResourceResponseDto,
  UpdateUserResourcePayloadDto,
  RemoveUserResourcePayloadDto,
} from '@grande-armee/pocket-common';

import { UserResourceService } from '@domain/userResource/services/userResource/userResourceService';
import { UnitOfWorkFactory } from '@shared/unitOfWork/providers/unitOfWorkFactory';

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
