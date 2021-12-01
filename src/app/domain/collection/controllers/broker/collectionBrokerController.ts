import { DtoFactory } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';

import { UnitOfWorkFactory } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { CollectionService } from '../../services/collection/collectionService';
import { FindCollectionPayloadDto, FindCollectionResponseDto } from './dtos/findCollectionDto';
import { RemoveCollectionPayloadDto } from './dtos/removeCollectionDto';
import { UpdateCollectionPayloadDto, UpdateCollectionResponseDto } from './dtos/updateCollectionDto';

@Injectable()
export class CollectionBrokerController {
  public constructor(
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    private readonly dtoFactory: DtoFactory,
    private readonly collectionService: CollectionService,
  ) {}

  public async findCollection(payload: FindCollectionPayloadDto): Promise<FindCollectionResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const collection = await unitOfWork.runInTransaction(async () => {
      const { collectionId } = payload;

      const collection = await this.collectionService.findCollection(unitOfWork, collectionId);

      return collection;
    });

    return this.dtoFactory.createDtoInstance(FindCollectionResponseDto, {
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

  public async updateCollection(payload: UpdateCollectionPayloadDto): Promise<UpdateCollectionResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const collection = await unitOfWork.runInTransaction(async () => {
      const { collectionId, thumbnailUrl, content, title } = payload;

      const collection = await this.collectionService.updateCollection(unitOfWork, collectionId, {
        thumbnailUrl,
        content,
        title,
      });

      return collection;
    });

    return this.dtoFactory.createDtoInstance(UpdateCollectionResponseDto, {
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

  public async removeCollection(payload: RemoveCollectionPayloadDto): Promise<void> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    await unitOfWork.runInTransaction(async () => {
      const { collectionId } = payload;

      const collection = await this.collectionService.removeCollection(unitOfWork, collectionId);

      return collection;
    });
  }
}
