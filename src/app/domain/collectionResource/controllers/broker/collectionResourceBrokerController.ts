import { DtoFactory } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';

import { UnitOfWorkFactory } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { CollectionResourceService } from '../../services/collectionResource/collectionResourceService';
import {
  CreateCollectionResourcePayloadDto,
  CreateCollectionResourceResponseDto,
} from './dtos/createCollectionResourceDto';
import { RemoveCollectionResourcePayloadDto } from './dtos/removeCollectionResourceDto';

@Injectable()
export class CollectionResourceBrokerController {
  public constructor(
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    private readonly dtoFactory: DtoFactory,
    private readonly collectionResourceService: CollectionResourceService,
  ) {}

  public async createCollectionResource(
    payload: CreateCollectionResourcePayloadDto,
  ): Promise<CreateCollectionResourceResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const collection = await unitOfWork.runInTransaction(async () => {
      const { collectionId, resourceId } = payload;

      const collection = await this.collectionResourceService.createCollectionResource(unitOfWork, {
        collectionId,
        resourceId,
      });

      return collection;
    });

    return this.dtoFactory.createDtoInstance(CreateCollectionResourceResponseDto, {
      collectionResource: {
        id: collection.id,
        createdAt: collection.createdAt,
        updatedAt: collection.updatedAt,
        collectionId: collection.collectionId,
        resourceId: collection.resourceId,
      },
    });
  }

  public async removeCollectionResource(payload: RemoveCollectionResourcePayloadDto): Promise<void> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    await unitOfWork.runInTransaction(async () => {
      const { collectionId, resourceId } = payload;

      const collection = await this.collectionResourceService.removeCollectionResource(unitOfWork, {
        collectionId,
        resourceId,
      });

      return collection;
    });
  }
}
