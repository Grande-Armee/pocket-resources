import { Injectable } from '@nestjs/common';

import { BrokerService } from '../../services/broker/brokerService';
import { CreateResourcePayloadDto, CreateResourceResponseDto } from './requests/createResource';
import { FindResourcePayloadDto, FindResourceResponseDto } from './requests/findResource';
import { RemoveResourcePayloadDto } from './requests/removeResource';
import { UpdateResourcePayloadDto, UpdateResourceResponseDto } from './requests/updateResource';
import { ResourceRoutingKey } from './resourceRoutingKey';

@Injectable()
export class ResourceTransporter {
  public constructor(private readonly brokerService: BrokerService) {}

  public async createResource(payload: CreateResourcePayloadDto): Promise<CreateResourceResponseDto> {
    const data = this.brokerService.createRpcData(CreateResourcePayloadDto, payload);

    return this.brokerService.request(ResourceRoutingKey.createResource, data);
  }

  public async findResource(payload: FindResourcePayloadDto): Promise<FindResourceResponseDto> {
    const data = this.brokerService.createRpcData(FindResourcePayloadDto, payload);

    return this.brokerService.request(ResourceRoutingKey.findResource, data);
  }

  public async updateResource(payload: UpdateResourcePayloadDto): Promise<UpdateResourceResponseDto> {
    const data = this.brokerService.createRpcData(UpdateResourcePayloadDto, payload);

    return this.brokerService.request(ResourceRoutingKey.updateResource, data);
  }

  public async removeResource(payload: RemoveResourcePayloadDto): Promise<void> {
    const data = this.brokerService.createRpcData(RemoveResourcePayloadDto, payload);

    return this.brokerService.request(ResourceRoutingKey.removeResource, data);
  }
}
