import { Injectable } from '@nestjs/common';

import { BrokerService } from '../../services/broker/brokerService';
import { CollectionResourceRoutingKey } from './collectionResourceRoutingKey';
import {
  CreateCollectionResourcePayloadDto,
  CreateCollectionResourceResponseDto,
} from './requests/createCollectionResource';
import { RemoveCollectionResourcePayloadDto } from './requests/removeCollectionResource';

@Injectable()
export class CollectionResourceTransporter {
  public constructor(private readonly brokerService: BrokerService) {}

  public async createCollectionResource(
    payload: CreateCollectionResourcePayloadDto,
  ): Promise<CreateCollectionResourceResponseDto> {
    const data = this.brokerService.createRpcData(CreateCollectionResourcePayloadDto, payload);

    return this.brokerService.request(CollectionResourceRoutingKey.createCollectionResource, data);
  }

  public async removeCollectionResource(payload: RemoveCollectionResourcePayloadDto): Promise<void> {
    const data = this.brokerService.createRpcData(RemoveCollectionResourcePayloadDto, payload);

    return this.brokerService.request(CollectionResourceRoutingKey.removeCollectionResource, data);
  }
}
