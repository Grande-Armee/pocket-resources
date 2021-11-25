import { DtoFactory } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';

import { UnitOfWorkFactory } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { CollectionService } from '../../services/collection/collectionService';
import { CreateCollectionPayloadDto, CreateCollectionResponseDto } from './dtos/createCollectionDto';

@Injectable()
export class CollectionBrokerController {
  public constructor(
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    private readonly dtoFactory: DtoFactory,
    private readonly collectionService: CollectionService,
  ) {}

  public async createCollection(payload: CreateCollectionPayloadDto): Promise<CreateCollectionResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const collection = await unitOfWork.runInTransaction(async () => {
      const { title, userId } = payload;

      const collection = await this.collectionService.createCollection(unitOfWork, {
        title,
        userId,
      });

      return collection;
    });

    return this.dtoFactory.createDtoInstance(CreateCollectionResponseDto, {
      collection: {
        id: collection.id,
      },
    });
  }
}
