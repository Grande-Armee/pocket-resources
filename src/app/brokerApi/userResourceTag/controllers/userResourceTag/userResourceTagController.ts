import {
  BrokerController,
  BrokerService,
  RpcRoute,
  UserResourceTagRoutingKey,
  BrokerMessage,
  CreateUserResourceTagResponseDto,
  CreateUserResourceTagPayloadDto,
  RemoveUserResourceTagPayloadDto,
  UserResourceTagDto,
} from '@grande-armee/pocket-common';

import { UserResourceTagService } from '@domain/userResourceTag/services/userResourceTag/userResourceTagService';
import { UnitOfWorkFactory } from '@shared/unitOfWork/providers/unitOfWorkFactory';

@BrokerController()
export class UserResourceTagBrokerController {
  public constructor(
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    private readonly brokerService: BrokerService,
    private readonly userResourceTagService: UserResourceTagService,
  ) {}

  @RpcRoute(UserResourceTagRoutingKey.createUserResourceTag)
  public async createUserResourceTag(_: unknown, message: BrokerMessage): Promise<CreateUserResourceTagResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(message);
    const payload = CreateUserResourceTagPayloadDto.create(data.payload);

    const { userId, resourceId, tagId } = payload;

    const userResourceTag = await unitOfWork.runInTransaction(async () => {
      const userResourceTag = await this.userResourceTagService.createUserResourceTag(unitOfWork, {
        userId,
        resourceId,
        tagId,
      });

      return userResourceTag;
    });

    const result = CreateUserResourceTagResponseDto.create({
      userResourceTag: UserResourceTagDto.create({
        id: userResourceTag.id,
        createdAt: userResourceTag.createdAt,
        updatedAt: userResourceTag.updatedAt,
        userId: userId,
        resourceId: resourceId,
        tagId: userResourceTag.tagId,
      }),
    });

    await this.brokerService.publishEvents(unitOfWork.integrationEventsStore.getEvents());

    return result;
  }

  @RpcRoute(UserResourceTagRoutingKey.removeUserResourceTag)
  public async removeUserResourceTag(_: unknown, message: BrokerMessage): Promise<void> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(message);
    const payload = RemoveUserResourceTagPayloadDto.create(data.payload);

    await unitOfWork.runInTransaction(async () => {
      const { userId, resourceId, tagId } = payload;

      await this.userResourceTagService.removeUserResourceTag(unitOfWork, { userId, resourceId, tagId });
    });

    await this.brokerService.publishEvents(unitOfWork.integrationEventsStore.getEvents());
  }
}
