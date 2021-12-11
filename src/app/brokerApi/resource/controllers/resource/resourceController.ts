import {
  BrokerController,
  BrokerService,
  DtoFactory,
  RpcRoute,
  ResourceRoutingKey,
  BrokerMessage,
  CreateResourceResponseDto,
  CreateResourcePayloadDto,
  FindResourceResponseDto,
  FindResourcePayloadDto,
  UpdateResourceResponseDto,
  UpdateResourcePayloadDto,
  RemoveResourcePayloadDto,
} from '@grande-armee/pocket-common';

import { ResourceService } from '@domain/resource/services/resource/resourceService';
import { UnitOfWorkFactory } from '@shared/unitOfWork/providers/unitOfWorkFactory';

@BrokerController()
export class ResourceBrokerController {
  public constructor(
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    private readonly brokerService: BrokerService,
    private readonly dtoFactory: DtoFactory,
    private readonly resourceService: ResourceService,
  ) {}

  @RpcRoute(ResourceRoutingKey.createResource)
  public async createResource(_: unknown, message: BrokerMessage): Promise<CreateResourceResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(CreateResourcePayloadDto, message);

    const resource = await unitOfWork.runInTransaction(async () => {
      const { url } = data.payload;

      const resource = await this.resourceService.createResource(unitOfWork, {
        url,
      });

      return resource;
    });

    const result = this.dtoFactory.create(CreateResourceResponseDto, {
      resource: {
        id: resource.id,
        createdAt: resource.createdAt,
        updatedAt: resource.updatedAt,
        url: resource.url,
        title: resource.title,
        thumbnailUrl: resource.thumbnailUrl,
        content: resource.content,
      },
    });

    await this.brokerService.publishEvents(unitOfWork.integrationEventsStore.getEvents());

    return result;
  }

  @RpcRoute(ResourceRoutingKey.findResource)
  public async findResource(_: unknown, message: BrokerMessage): Promise<FindResourceResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(FindResourcePayloadDto, message);

    const resource = await unitOfWork.runInTransaction(async () => {
      const { resourceId } = data.payload;

      const resource = await this.resourceService.findResource(unitOfWork, resourceId);

      return resource;
    });

    return this.dtoFactory.create(FindResourceResponseDto, {
      resource: {
        id: resource.id,
        createdAt: resource.createdAt,
        updatedAt: resource.updatedAt,
        url: resource.url,
        title: resource.title,
        thumbnailUrl: resource.thumbnailUrl,
        content: resource.content,
      },
    });
  }

  @RpcRoute(ResourceRoutingKey.updateResource)
  public async updateResource(_: unknown, message: BrokerMessage): Promise<UpdateResourceResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(UpdateResourcePayloadDto, message);

    const resource = await unitOfWork.runInTransaction(async () => {
      const { resourceId, title, content, thumbnailUrl } = data.payload;

      const resource = await this.resourceService.updateResource(unitOfWork, resourceId, {
        title,
        content,
        thumbnailUrl,
      });

      return resource;
    });

    const result = this.dtoFactory.create(UpdateResourceResponseDto, {
      resource: {
        id: resource.id,
        createdAt: resource.createdAt,
        updatedAt: resource.updatedAt,
        url: resource.url,
        title: resource.title,
        thumbnailUrl: resource.thumbnailUrl,
        content: resource.content,
      },
    });

    await this.brokerService.publishEvents(unitOfWork.integrationEventsStore.getEvents());

    return result;
  }

  @RpcRoute(ResourceRoutingKey.removeResource)
  public async removeResource(_: unknown, message: BrokerMessage): Promise<void> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(RemoveResourcePayloadDto, message);

    await unitOfWork.runInTransaction(async () => {
      const { resourceId } = data.payload;

      await this.resourceService.removeResource(unitOfWork, resourceId);
    });

    await this.brokerService.publishEvents(unitOfWork.integrationEventsStore.getEvents());
  }
}
