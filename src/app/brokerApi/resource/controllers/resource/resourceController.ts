import {
  BrokerController,
  BrokerService,
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
  ResourceDto,
} from '@grande-armee/pocket-common';

import { ResourceService } from '@domain/resource/services/resource/resourceService';
import { UnitOfWorkFactory } from '@shared/unitOfWork/providers/unitOfWorkFactory';

@BrokerController()
export class ResourceBrokerController {
  public constructor(
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    private readonly brokerService: BrokerService,
    private readonly resourceService: ResourceService,
  ) {}

  @RpcRoute(ResourceRoutingKey.createResource)
  public async createResource(_: unknown, message: BrokerMessage): Promise<CreateResourceResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(message);
    const payload = CreateResourcePayloadDto.create(data.payload);

    const resource = await unitOfWork.runInTransaction(async () => {
      const { url } = payload;

      const resource = await this.resourceService.createResource(unitOfWork, {
        url,
      });

      return resource;
    });

    const result = CreateResourceResponseDto.create({
      resource: ResourceDto.create({
        id: resource.id,
        createdAt: resource.createdAt,
        updatedAt: resource.updatedAt,
        url: resource.url,
        title: resource.title,
        thumbnailUrl: resource.thumbnailUrl,
        content: resource.content,
      }),
    });

    await this.brokerService.publishEvents(unitOfWork.integrationEventsStore.getEvents());

    return result;
  }

  @RpcRoute(ResourceRoutingKey.findResource)
  public async findResource(_: unknown, message: BrokerMessage): Promise<FindResourceResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(message);
    const payload = FindResourcePayloadDto.create(data.payload);

    const resource = await unitOfWork.runInTransaction(async () => {
      const { resourceId } = payload;

      const resource = await this.resourceService.findResource(unitOfWork, resourceId);

      return resource;
    });

    return FindResourceResponseDto.create({
      resource: ResourceDto.create({
        id: resource.id,
        createdAt: resource.createdAt,
        updatedAt: resource.updatedAt,
        url: resource.url,
        title: resource.title,
        thumbnailUrl: resource.thumbnailUrl,
        content: resource.content,
      }),
    });
  }

  @RpcRoute(ResourceRoutingKey.updateResource)
  public async updateResource(_: unknown, message: BrokerMessage): Promise<UpdateResourceResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(message);
    const payload = UpdateResourcePayloadDto.create(data.payload);

    const resource = await unitOfWork.runInTransaction(async () => {
      const { resourceId, title, content, thumbnailUrl } = payload;

      const resource = await this.resourceService.updateResource(unitOfWork, resourceId, {
        title,
        content,
        thumbnailUrl,
      });

      return resource;
    });

    const result = UpdateResourceResponseDto.create({
      resource: ResourceDto.create({
        id: resource.id,
        createdAt: resource.createdAt,
        updatedAt: resource.updatedAt,
        url: resource.url,
        title: resource.title,
        thumbnailUrl: resource.thumbnailUrl,
        content: resource.content,
      }),
    });

    await this.brokerService.publishEvents(unitOfWork.integrationEventsStore.getEvents());

    return result;
  }

  @RpcRoute(ResourceRoutingKey.removeResource)
  public async removeResource(_: unknown, message: BrokerMessage): Promise<void> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const { data } = await this.brokerService.parseMessage(message);
    const payload = RemoveResourcePayloadDto.create(data.payload);

    await unitOfWork.runInTransaction(async () => {
      const { resourceId } = payload;

      await this.resourceService.removeResource(unitOfWork, resourceId);
    });

    await this.brokerService.publishEvents(unitOfWork.integrationEventsStore.getEvents());
  }
}
