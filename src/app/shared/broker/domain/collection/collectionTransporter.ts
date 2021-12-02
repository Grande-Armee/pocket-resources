import { Injectable } from '@nestjs/common';

import { BrokerService } from '../../services/broker/brokerService';
import { CollectionRoutingKey } from './collectionRoutingKey';
import { CreateCollectionPayloadDto, CreateCollectionResponseDto } from './requests/createCollection';
import { FindCollectionPayloadDto, FindCollectionResponseDto } from './requests/findCollection';
import { RemoveCollectionPayloadDto } from './requests/removeCollection';
import { UpdateCollectionPayloadDto, UpdateCollectionResponseDto } from './requests/updateCollection';

@Injectable()
export class CollectionTransporter {
  public constructor(private readonly brokerService: BrokerService) {}

  public async createCollection(payload: CreateCollectionPayloadDto): Promise<CreateCollectionResponseDto> {
    const data = this.brokerService.createRpcData(CreateCollectionPayloadDto, payload);

    return this.brokerService.request(CollectionRoutingKey.createCollection, data);
  }

  public async findCollection(payload: FindCollectionPayloadDto): Promise<FindCollectionResponseDto> {
    const data = this.brokerService.createRpcData(FindCollectionPayloadDto, payload);

    return this.brokerService.request(CollectionRoutingKey.findCollection, data);
  }

  public async updateCollection(payload: UpdateCollectionPayloadDto): Promise<UpdateCollectionResponseDto> {
    const data = this.brokerService.createRpcData(UpdateCollectionPayloadDto, payload);

    return this.brokerService.request(CollectionRoutingKey.updateCollection, data);
  }

  public async removeCollection(payload: RemoveCollectionPayloadDto): Promise<void> {
    const data = this.brokerService.createRpcData(RemoveCollectionPayloadDto, payload);

    return this.brokerService.request(CollectionRoutingKey.removeCollection, data);
  }
}
