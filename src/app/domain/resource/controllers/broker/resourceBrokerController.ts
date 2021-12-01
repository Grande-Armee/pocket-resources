import { DtoFactory } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';

import { UnitOfWorkFactory } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { ResourceService } from '../../services/resource/resourceService';
import { CreateResourcePayloadDto, CreateResourceResponseDto } from './dtos/createResourceDto';
import { FindResourcePayloadDto, FindResourceResponseDto } from './dtos/findResourceDto';
import { RemoveResourcePayloadDto } from './dtos/removeResourceDto';
import { UpdateResourcePayloadDto, UpdateResourceResponseDto } from './dtos/updateResourceDto';

@Injectable()
export class ResourceBrokerController {
  public constructor(
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    private readonly dtoFactory: DtoFactory,
    private readonly resourceService: ResourceService,
  ) {}

  public async createResource(payload: CreateResourcePayloadDto): Promise<CreateResourceResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const resource = await unitOfWork.runInTransaction(async () => {
      const { url } = payload;

      const resource = await this.resourceService.createResource(unitOfWork, {
        url,
      });

      return resource;
    });

    return this.dtoFactory.create(CreateResourceResponseDto, {
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

  public async findResource(payload: FindResourcePayloadDto): Promise<FindResourceResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const resource = await unitOfWork.runInTransaction(async () => {
      const { resourceId } = payload;

      const resource = await this.resourceService.findResource(unitOfWork, resourceId);

      return resource;
    });

    return this.dtoFactory.create(CreateResourceResponseDto, {
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

  public async updateResource(payload: UpdateResourcePayloadDto): Promise<UpdateResourceResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const resource = await unitOfWork.runInTransaction(async () => {
      const { resourceId, thumbnailUrl, content, title } = payload;

      const resource = await this.resourceService.updateResource(unitOfWork, resourceId, {
        thumbnailUrl,
        content,
        title,
      });

      return resource;
    });

    return this.dtoFactory.create(CreateResourceResponseDto, {
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

  public async removeResource(payload: RemoveResourcePayloadDto): Promise<void> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    await unitOfWork.runInTransaction(async () => {
      const { resourceId } = payload;

      const resource = await this.resourceService.removeResource(unitOfWork, resourceId);

      return resource;
    });
  }
}
