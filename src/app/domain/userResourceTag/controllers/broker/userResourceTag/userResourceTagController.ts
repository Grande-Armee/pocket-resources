import { DtoFactory } from '@grande-armee/pocket-common';

import { BrokerController } from '@shared/broker/decorators/brokerController';
import { RpcRoute } from '@shared/broker/decorators/rpcRoute';
import {
  CreateUserResourceTagPayloadDto,
  CreateUserResourceTagResponseDto,
} from '@shared/broker/domain/userResourceTag/requests/createUserResourceTag';
import { RemoveUserResourceTagPayloadDto } from '@shared/broker/domain/userResourceTag/requests/removeUserResourceTag';
import { UserResourceTagRoutingKey } from '@shared/broker/domain/userResourceTag/userResourceTagRoutingKey';
import { BrokerService } from '@shared/broker/services/broker/brokerService';
import { BrokerMessage } from '@shared/broker/types';
import { UnitOfWorkFactory } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { UserResourceTagService } from '../../../services/userResourceTag/userResourceTagService';

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

    const userResourceTag = await unitOfWork.runInTransaction(async () => {
      const { userId, resourceId, tagId } = data.payload;

      const userResourceTag = await this.userResourceTagService.createUserResourceTag(unitOfWork, {
        userId,
        resourceId,
        tagId,
      });

      return userResourceTag;
    });

    // TODO: fix assigning the same id to userId and resourceId
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

  @RpcRoute(UserResourceTagRoutingKey.removeUserResourceTag)
  public async removeUserResourceTag(_: unknown, message: BrokerMessage): Promise<void> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(RemoveUserResourceTagPayloadDto, message);

    await unitOfWork.runInTransaction(async () => {
      const { userId, resourceId, tagId } = data.payload;

      await this.userResourceTagService.removeUserResourceTag(unitOfWork, { userId, resourceId, tagId });
    });
  }
}
