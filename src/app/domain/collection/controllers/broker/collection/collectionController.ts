import { DtoFactory } from '@grande-armee/pocket-common';

import { BrokerController } from '@shared/broker/decorators/brokerController';
import { RpcRoute } from '@shared/broker/decorators/rpcRoute';
import { CollectionRoutingKey } from '@shared/broker/domain/collection/collectionRoutingKey';
import {
  CreateCollectionPayloadDto,
  CreateCollectionResponseDto,
} from '@shared/broker/domain/collection/requests/createCollection';
import {
  FindCollectionPayloadDto,
  FindCollectionResponseDto,
} from '@shared/broker/domain/collection/requests/findCollection';
import { RemoveCollectionPayloadDto } from '@shared/broker/domain/collection/requests/removeCollection';
import {
  UpdateCollectionPayloadDto,
  UpdateCollectionResponseDto,
} from '@shared/broker/domain/collection/requests/updateCollection';
import { BrokerService } from '@shared/broker/services/broker/brokerService';
import { BrokerMessage } from '@shared/broker/types';
import { UnitOfWorkFactory } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { CollectionService } from '../../../services/collection/collectionService';

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

    return this.dtoFactory.create(CreateCollectionResponseDto, {
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

  @RpcRoute(CollectionRoutingKey.findCollection)
  public async findCollection(_: unknown, message: BrokerMessage): Promise<FindCollectionResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(FindCollectionPayloadDto, message);

    const collection = await unitOfWork.runInTransaction(async () => {
      const { collectionId } = data.payload;

      const collection = await this.collectionService.findCollection(unitOfWork, collectionId);

      return collection;
    });

    return this.dtoFactory.create(CreateCollectionResponseDto, {
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

    return this.dtoFactory.create(CreateCollectionResponseDto, {
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

  @RpcRoute(CollectionRoutingKey.removeCollection)
  public async removeCollection(_: unknown, message: BrokerMessage): Promise<void> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(RemoveCollectionPayloadDto, message);

    await unitOfWork.runInTransaction(async () => {
      const { collectionId } = data.payload;

      await this.collectionService.removeCollection(unitOfWork, collectionId);
    });
  }
}
