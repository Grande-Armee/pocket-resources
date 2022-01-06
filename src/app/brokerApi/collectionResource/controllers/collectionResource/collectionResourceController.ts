import {
  BrokerController,
  BrokerService,
  RpcRoute,
  CollectionResourceRoutingKey,
  BrokerMessage,
  CreateCollectionResourceResponseDto,
  CreateCollectionResourcePayloadDto,
  RemoveCollectionResourcePayloadDto,
  CollectionResourceDto,
} from '@grande-armee/pocket-common';

import { CollectionResourceService } from '@domain/collectionResource/services/collectionResource/collectionResourceService';
import { UnitOfWorkFactory } from '@shared/unitOfWork/providers/unitOfWorkFactory';

@BrokerController()
export class CollectionResourceBrokerController {
  public constructor(
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    private readonly brokerService: BrokerService,
    private readonly collectionResourceService: CollectionResourceService,
  ) {}

  @RpcRoute(CollectionResourceRoutingKey.createCollectionResource)
  public async createCollectionResource(
    _: unknown,
    message: BrokerMessage,
  ): Promise<CreateCollectionResourceResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(message);
    const payload = CreateCollectionResourcePayloadDto.create(data.payload);

    const collectionResource = await unitOfWork.runInTransaction(async () => {
      const { collectionId, resourceId } = payload;

      const collectionResource = await this.collectionResourceService.createCollectionResource(unitOfWork, {
        collectionId,
        resourceId,
      });

      return collectionResource;
    });

    const result = CreateCollectionResourceResponseDto.create({
      collectionResource: CollectionResourceDto.create({
        id: collectionResource.id,
        createdAt: collectionResource.createdAt,
        updatedAt: collectionResource.updatedAt,
        collectionId: collectionResource.collectionId,
        resourceId: collectionResource.resourceId,
      }),
    });

    await this.brokerService.publishEvents(unitOfWork.integrationEventsStore.getEvents());

    return result;
  }

  @RpcRoute(CollectionResourceRoutingKey.removeCollectionResource)
  public async removeCollectionResource(_: unknown, message: BrokerMessage): Promise<void> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(message);
    const payload = RemoveCollectionResourcePayloadDto.create(data.payload);

    await unitOfWork.runInTransaction(async () => {
      const { collectionId, resourceId } = payload;

      await this.collectionResourceService.removeCollectionResource(unitOfWork, { collectionId, resourceId });
    });

    await this.brokerService.publishEvents(unitOfWork.integrationEventsStore.getEvents());
  }
}
