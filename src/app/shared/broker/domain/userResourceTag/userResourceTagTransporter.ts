import { Injectable } from '@nestjs/common';

import { BrokerService } from '../../services/broker/brokerService';
import { CreateUserResourceTagPayloadDto, CreateUserResourceTagResponseDto } from './requests/createUserResourceTag';
import { RemoveUserResourceTagPayloadDto } from './requests/removeUserResourceTag';
import { UserResourceTagRoutingKey } from './userResourceTagRoutingKey';

@Injectable()
export class UserResourceTagTransporter {
  public constructor(private readonly brokerService: BrokerService) {}

  public async createUserResourceTag(
    payload: CreateUserResourceTagPayloadDto,
  ): Promise<CreateUserResourceTagResponseDto> {
    const data = this.brokerService.createRpcData(CreateUserResourceTagPayloadDto, payload);

    return this.brokerService.request(UserResourceTagRoutingKey.createUserResourceTag, data);
  }

  public async removeUserResourceTag(payload: RemoveUserResourceTagPayloadDto): Promise<void> {
    const data = this.brokerService.createRpcData(RemoveUserResourceTagPayloadDto, payload);

    return this.brokerService.request(UserResourceTagRoutingKey.removeUserResourceTag, data);
  }
}
