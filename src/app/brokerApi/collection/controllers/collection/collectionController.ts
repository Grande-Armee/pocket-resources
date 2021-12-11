import {
  BrokerController,
  BrokerMessage,
  BrokerService,
  CollectionRoutingKey,
  CreateCollectionPayloadDto,
  CreateCollectionResponseDto,
  DtoFactory,
  FindCollectionPayloadDto,
  FindCollectionResponseDto,
  RemoveCollectionPayloadDto,
  RpcRoute,
  UpdateCollectionPayloadDto,
  UpdateCollectionResponseDto,
} from '@grande-armee/pocket-common';

import { CollectionService } from '@domain/collection/services/collection/collectionService';
import { UnitOfWorkFactory } from '@shared/unitOfWork/providers/unitOfWorkFactory';

@BrokerController()
export class CollectionBrokerController {
  public constructor(
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    private readonly brokerService: BrokerService,
    private readonly dtoFactory: DtoFactory,
    private readonly collectionService: CollectionService,
  ) {}

  @RpcRoute(CollectionRoutingKey.createCollection)
  public async createCollection(_: unknown, message: BrokerMessage): Promise<CreateCollectionResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(CreateCollectionPayloadDto, message);

    const collection = await unitOfWork.runInTransaction(async () => {
      const { userId, title } = data.payload;

      const collection = await this.collectionService.createCollection(unitOfWork, {
        userId,
        title,
      });

      return collection;
    });

    const result = this.dtoFactory.create(CreateCollectionResponseDto, {
      collection: {
        id: collection.id,
        createdAt: collection.createdAt,
        updatedAt: collection.updatedAt,
        title: collection.title,
        thumbnailUrl: collection.thumbnailUrl,
        content: collection.content,
        userId: collection.userId,
        resources: collection.resources,
      },
    });

    await this.brokerService.publishEvents(unitOfWork.integrationEventsStore.getEvents());

    return result;
  }

  @RpcRoute(CollectionRoutingKey.findCollection)
  public async findCollection(_: unknown, message: BrokerMessage): Promise<FindCollectionResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(FindCollectionPayloadDto, message);

    const collection = await unitOfWork.runInTransaction(async () => {
      const { collectionId } = data.payload;

      const collection = await this.collectionService.findCollection(unitOfWork, collectionId);

      return collection;
    });

    return this.dtoFactory.create(FindCollectionResponseDto, {
      collection: {
        id: collection.id,
        createdAt: collection.createdAt,
        updatedAt: collection.updatedAt,
        title: collection.title,
        thumbnailUrl: collection.thumbnailUrl,
        content: collection.content,
        userId: collection.userId,
        resources: collection.resources,
      },
    });
  }

  @RpcRoute(CollectionRoutingKey.updateCollection)
  public async updateCollection(_: unknown, message: BrokerMessage): Promise<UpdateCollectionResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(UpdateCollectionPayloadDto, message);

    const collection = await unitOfWork.runInTransaction(async () => {
      const { collectionId, title, content, thumbnailUrl } = data.payload;

      const collection = await this.collectionService.updateCollection(unitOfWork, collectionId, {
        title,
        content,
        thumbnailUrl,
      });

      return collection;
    });

    const result = this.dtoFactory.create(UpdateCollectionResponseDto, {
      collection: {
        id: collection.id,
        createdAt: collection.createdAt,
        updatedAt: collection.updatedAt,
        title: collection.title,
        thumbnailUrl: collection.thumbnailUrl,
        content: collection.content,
        userId: collection.userId,
        resources: collection.resources,
      },
    });

    await this.brokerService.publishEvents(unitOfWork.integrationEventsStore.getEvents());

    return result;
  }

  @RpcRoute(CollectionRoutingKey.removeCollection)
  public async removeCollection(_: unknown, message: BrokerMessage): Promise<void> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(RemoveCollectionPayloadDto, message);

    await unitOfWork.runInTransaction(async () => {
      const { collectionId } = data.payload;

      await this.collectionService.removeCollection(unitOfWork, collectionId);
    });

    await this.brokerService.publishEvents(unitOfWork.integrationEventsStore.getEvents());
  }
}
