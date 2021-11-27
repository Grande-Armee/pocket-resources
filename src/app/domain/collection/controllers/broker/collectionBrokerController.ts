import { DtoFactory } from '@grande-armee/pocket-common';
import { Controller } from '@nestjs/common';

import { EventRoute } from '@shared/broker/eventRoute';
import { BrokerMessage } from '@shared/broker/interfaces';
import { BrokerService } from '@shared/broker/services/broker/brokerService';
import { UnitOfWorkFactory } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { CollectionService } from '../../services/collection/collectionService';
import { CreateCollectionPayloadDto, CreateCollectionResponseDto } from './dtos/createCollectionDto';

@Controller()
export class CollectionBrokerController {
  public constructor(
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    private readonly dtoFactory: DtoFactory,
    private readonly collectionService: CollectionService,
    private readonly brokerService: BrokerService,
  ) {}

  @EventRoute('pocket.resources.collections.createCollection')
  public async createCollection(message: BrokerMessage): Promise<CreateCollectionResponseDto> {
    return this.brokerService.handleMessage(
      message,
      CreateCollectionPayloadDto,
      CreateCollectionResponseDto,
      async (payload) => {
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
      },
    );
  }
}
