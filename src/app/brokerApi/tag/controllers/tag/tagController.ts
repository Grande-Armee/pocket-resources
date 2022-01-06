import {
  BrokerController,
  BrokerService,
  RpcRoute,
  TagRoutingKey,
  BrokerMessage,
  CreateTagResponseDto,
  CreateTagPayloadDto,
  FindTagResponseDto,
  FindTagPayloadDto,
  UpdateTagResponseDto,
  UpdateTagPayloadDto,
  RemoveTagPayloadDto,
  TagDto,
} from '@grande-armee/pocket-common';

import { TagService } from '@domain/tag/services/tag/tagService';
import { UnitOfWorkFactory } from '@shared/unitOfWork/providers/unitOfWorkFactory';

@BrokerController()
export class TagBrokerController {
  public constructor(
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    private readonly brokerService: BrokerService,
    private readonly tagService: TagService,
  ) {}

  @RpcRoute(TagRoutingKey.createTag)
  public async createTag(_: unknown, message: BrokerMessage): Promise<CreateTagResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(message);
    const payload = CreateTagPayloadDto.create(data.payload);

    const tag = await unitOfWork.runInTransaction(async () => {
      const { color, title, userId } = payload;

      const tag = await this.tagService.createTag(unitOfWork, {
        color,
        title,
        userId,
      });

      return tag;
    });

    const result = CreateTagResponseDto.create({
      tag: TagDto.create({
        id: tag.id,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
        color: tag.color,
        title: tag.title,
        userId: tag.userId,
      }),
    });

    await this.brokerService.publishEvents(unitOfWork.integrationEventsStore.getEvents());

    return result;
  }

  @RpcRoute(TagRoutingKey.findTag)
  public async findTag(_: unknown, message: BrokerMessage): Promise<FindTagResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(message);
    const payload = FindTagPayloadDto.create(data.payload);

    const tag = await unitOfWork.runInTransaction(async () => {
      const { tagId } = payload;

      const tag = await this.tagService.findTag(unitOfWork, tagId);

      return tag;
    });

    return FindTagResponseDto.create({
      tag: TagDto.create({
        id: tag.id,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
        color: tag.color,
        title: tag.title,
        userId: tag.userId,
      }),
    });
  }

  @RpcRoute(TagRoutingKey.updateTag)
  public async updateTag(_: unknown, message: BrokerMessage): Promise<UpdateTagResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(message);
    const payload = UpdateTagPayloadDto.create(data.payload);

    const tag = await unitOfWork.runInTransaction(async () => {
      const { tagId, color, title } = payload;

      const tag = await this.tagService.updateTag(unitOfWork, tagId, {
        color,
        title,
      });

      return tag;
    });

    const result = UpdateTagResponseDto.create({
      tag: TagDto.create({
        id: tag.id,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
        color: tag.color,
        title: tag.title,
        userId: tag.userId,
      }),
    });

    await this.brokerService.publishEvents(unitOfWork.integrationEventsStore.getEvents());

    return result;
  }

  @RpcRoute(TagRoutingKey.removeTag)
  public async removeTag(_: unknown, message: BrokerMessage): Promise<void> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(message);
    const payload = RemoveTagPayloadDto.create(data.payload);

    await unitOfWork.runInTransaction(async () => {
      const { tagId } = payload;

      await this.tagService.removeTag(unitOfWork, tagId);
    });

    await this.brokerService.publishEvents(unitOfWork.integrationEventsStore.getEvents());
  }
}
