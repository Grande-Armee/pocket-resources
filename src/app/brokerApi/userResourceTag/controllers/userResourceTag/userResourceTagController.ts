import {
  BrokerController,
  BrokerService,
  DtoFactory,
  RpcRoute,
  UserResourceTagRoutingKey,
  BrokerMessage,
  CreateUserResourceTagResponseDto,
  CreateUserResourceTagPayloadDto,
  RemoveUserResourceTagPayloadDto,
} from '@grande-armee/pocket-common';

import { UserResourceTagService } from '@domain/userResourceTag/services/userResourceTag/userResourceTagService';
import { UnitOfWorkFactory } from '@shared/unitOfWork/providers/unitOfWorkFactory';

@BrokerController()
export class UserResourceTagBrokerController {
  public constructor(
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    private readonly brokerService: BrokerService,
    private readonly dtoFactory: DtoFactory,
    private readonly userResourceTagService: UserResourceTagService,
  ) {}

  @RpcRoute(UserResourceTagRoutingKey.createUserResourceTag)
  public async createUserResourceTag(_: unknown, message: BrokerMessage): Promise<CreateUserResourceTagResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(CreateUserResourceTagPayloadDto, message);

    const { userId, resourceId, tagId } = data.payload;

    const userResourceTag = await unitOfWork.runInTransaction(async () => {
      const userResourceTag = await this.userResourceTagService.createUserResourceTag(unitOfWork, {
        userId,
        resourceId,
        tagId,
      });

      return userResourceTag;
    });

    const result = this.dtoFactory.create(CreateUserResourceTagResponseDto, {
      userResourceTag: {
        id: userResourceTag.id,
        createdAt: userResourceTag.createdAt,
        updatedAt: userResourceTag.updatedAt,
        userId: userId,
        resourceId: resourceId,
        tagId: userResourceTag.tagId,
      },
    });

    await this.brokerService.publishEvents(unitOfWork.integrationEventsStore.getEvents());

    return result;
  }

  @RpcRoute(UserResourceTagRoutingKey.removeUserResourceTag)
  public async removeUserResourceTag(_: unknown, message: BrokerMessage): Promise<void> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(RemoveUserResourceTagPayloadDto, message);

    await unitOfWork.runInTransaction(async () => {
      const { userId, resourceId, tagId } = data.payload;

      await this.userResourceTagService.removeUserResourceTag(unitOfWork, { userId, resourceId, tagId });
    });

    await this.brokerService.publishEvents(unitOfWork.integrationEventsStore.getEvents());
  }
}
