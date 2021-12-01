import { DtoFactory } from '@grande-armee/pocket-common';

import { BrokerController } from '@shared/broker/decorators/brokerController';
import { RpcRoute } from '@shared/broker/decorators/rpcRoute';
import { CreateTagPayloadDto, CreateTagResponseDto } from '@shared/broker/domain/tag/requests/createTag';
import { FindTagPayloadDto, FindTagResponseDto } from '@shared/broker/domain/tag/requests/findTag';
import { RemoveTagPayloadDto } from '@shared/broker/domain/tag/requests/removeTag';
import { UpdateTagPayloadDto, UpdateTagResponseDto } from '@shared/broker/domain/tag/requests/updateTag';
import { TagRoutingKey } from '@shared/broker/domain/tag/tagRoutingKey';
import { BrokerService } from '@shared/broker/services/broker/brokerService';
import { BrokerMessage } from '@shared/broker/types';
import { UnitOfWorkFactory } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { TagService } from '../../../services/tag/tagService';

@BrokerController()
export class TagBrokerController {
  public constructor(
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    private readonly brokerService: BrokerService,
    private readonly dtoFactory: DtoFactory,
    private readonly tagService: TagService,
  ) {}

  @RpcRoute(TagRoutingKey.createTag)
  public async createTag(_: unknown, message: BrokerMessage): Promise<CreateTagResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(CreateTagPayloadDto, message);

    const tag = await unitOfWork.runInTransaction(async () => {
      const { color, title, userId } = data.payload;

      const tag = await this.tagService.createTag(unitOfWork, {
        color,
        title,
        userId,
      });

      return tag;
    });

    return this.dtoFactory.create(CreateTagResponseDto, {
      tag: {
        id: tag.id,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
        color: tag.color,
        title: tag.title,
        userId: tag.userId,
      },
    });
  }

  @RpcRoute(TagRoutingKey.findTag)
  public async findTag(_: unknown, message: BrokerMessage): Promise<FindTagResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(FindTagPayloadDto, message);

    const tag = await unitOfWork.runInTransaction(async () => {
      const { tagId } = data.payload;

      const tag = await this.tagService.findTag(unitOfWork, tagId);

      return tag;
    });

    return this.dtoFactory.create(CreateTagResponseDto, {
      tag: {
        id: tag.id,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
        color: tag.color,
        title: tag.title,
        userId: tag.userId,
      },
    });
  }

  @RpcRoute(TagRoutingKey.updateTag)
  public async updateTag(_: unknown, message: BrokerMessage): Promise<UpdateTagResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(UpdateTagPayloadDto, message);

    const tag = await unitOfWork.runInTransaction(async () => {
      const { tagId, color, title } = data.payload;

      const tag = await this.tagService.updateTag(unitOfWork, tagId, {
        color,
        title,
      });

      return tag;
    });

    return this.dtoFactory.create(CreateTagResponseDto, {
      tag: {
        id: tag.id,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
        color: tag.color,
        title: tag.title,
        userId: tag.userId,
      },
    });
  }

  @RpcRoute(TagRoutingKey.removeTag)
  public async removeTag(_: unknown, message: BrokerMessage): Promise<void> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(RemoveTagPayloadDto, message);

    await unitOfWork.runInTransaction(async () => {
      const { tagId } = data.payload;

      await this.tagService.removeTag(unitOfWork, tagId);
    });
  }
}
