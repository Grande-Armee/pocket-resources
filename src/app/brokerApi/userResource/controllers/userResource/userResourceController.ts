import {
  BrokerController,
  BrokerService,
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
  UserResourceDto,
} from '@grande-armee/pocket-common';

import { UserResourceService } from '@domain/userResource/services/userResource/userResourceService';
import { UnitOfWorkFactory } from '@shared/unitOfWork/providers/unitOfWorkFactory';

@BrokerController()
export class UserResourceBrokerController {
  public constructor(
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    private readonly brokerService: BrokerService,
    private readonly userResourceService: UserResourceService,
  ) {}

  @RpcRoute(UserResourceRoutingKey.createUserResource)
  public async createUserResource(_: unknown, message: BrokerMessage): Promise<CreateUserResourceResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(message);
    const payload = CreateUserResourcePayloadDto.create(data.payload);

    const userResource = await unitOfWork.runInTransaction(async () => {
      const { userId, resourceId } = payload;

      const userResource = await this.userResourceService.createUserResource(unitOfWork, {
        userId,
        resourceId,
      });

      return userResource;
    });

    const result = CreateUserResourceResponseDto.create({
      userResource: UserResourceDto.create({
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
      }),
    });

    await this.brokerService.publishEvents(unitOfWork.integrationEventsStore.getEvents());

    return result;
  }

  @RpcRoute(UserResourceRoutingKey.findUserResource)
  public async findUserResource(_: unknown, message: BrokerMessage): Promise<FindUserResourceResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(message);
    const payload = FindUserResourcePayloadDto.create(data.payload);

    const userResource = await unitOfWork.runInTransaction(async () => {
      const { userId, resourceId } = payload;

      const userResource = await this.userResourceService.findUserResource(unitOfWork, { userId, resourceId });

      return userResource;
    });

    return FindUserResourceResponseDto.create({
      userResource: UserResourceDto.create({
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
      }),
    });
  }

  @RpcRoute(UserResourceRoutingKey.updateUserResource)
  public async updateUserResource(_: unknown, message: BrokerMessage): Promise<UpdateUserResourceResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(message);
    const payload = UpdateUserResourcePayloadDto.create(data.payload);

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

    const result = UpdateUserResourceResponseDto.create({
      userResource: UserResourceDto.create({
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
      }),
    });

    await this.brokerService.publishEvents(unitOfWork.integrationEventsStore.getEvents());

    return result;
  }

  @RpcRoute(UserResourceRoutingKey.removeUserResource)
  public async removeUserResource(_: unknown, message: BrokerMessage): Promise<void> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(message);
    const payload = RemoveUserResourcePayloadDto.create(data.payload);

    await unitOfWork.runInTransaction(async () => {
      const { userId, resourceId } = payload;

      await this.userResourceService.removeUserResource(unitOfWork, { userId, resourceId });
    });

    await this.brokerService.publishEvents(unitOfWork.integrationEventsStore.getEvents());
  }
}
