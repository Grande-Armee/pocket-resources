import {
  BrokerController,
  BrokerMessage,
  BrokerService,
  CollectionResourceRoutingKey,
  CreateCollectionResourcePayloadDto,
  CreateCollectionResourceResponseDto,
  DtoFactory,
  RemoveCollectionResourcePayloadDto,
  RpcRoute,
} from '@grande-armee/pocket-common';

import { UnitOfWorkFactory } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { CollectionResourceService } from '../../../services/collectionResource/collectionResourceService';

@BrokerController()
export class CollectionResourceBrokerController {
  public constructor(
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    private readonly brokerService: BrokerService,
    private readonly dtoFactory: DtoFactory,
    private readonly collectionResourceService: CollectionResourceService,
  ) {}

  @RpcRoute(CollectionResourceRoutingKey.createCollectionResource)
  public async createCollectionResource(
    _: unknown,
    message: BrokerMessage,
  ): Promise<CreateCollectionResourceResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(CreateCollectionResourcePayloadDto, message);

    const collectionResource = await unitOfWork.runInTransaction(async () => {
      const { collectionId, resourceId } = data.payload;

      const collectionResource = await this.collectionResourceService.createCollectionResource(unitOfWork, {
        collectionId,
        resourceId,
      });

      return collectionResource;
    });

    return this.dtoFactory.create(CreateCollectionResourceResponseDto, {
      collectionResource: {
        id: collectionResource.id,
        createdAt: collectionResource.createdAt,
        updatedAt: collectionResource.updatedAt,
        collectionId: collectionResource.collectionId,
        resourceId: collectionResource.resourceId,
      },
    });
  }

  @RpcRoute(CollectionResourceRoutingKey.removeCollectionResource)
  public async removeCollectionResource(_: unknown, message: BrokerMessage): Promise<void> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(RemoveCollectionResourcePayloadDto, message);

    await unitOfWork.runInTransaction(async () => {
      const { collectionId, resourceId } = data.payload;

      await this.collectionResourceService.removeCollectionResource(unitOfWork, { collectionId, resourceId });
    });
  }
}
