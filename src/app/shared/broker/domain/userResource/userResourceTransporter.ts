import { Injectable } from '@nestjs/common';

import { BrokerService } from '../../services/broker/brokerService';
import { CreateUserResourcePayloadDto, CreateUserResourceResponseDto } from './requests/createUserResource';
import { FindUserResourcePayloadDto, FindUserResourceResponseDto } from './requests/findUserResource';
import { RemoveUserResourcePayloadDto } from './requests/removeUserResource';
import { UpdateUserResourcePayloadDto, UpdateUserResourceResponseDto } from './requests/updateUserResource';
import { UserResourceRoutingKey } from './userResourceRoutingKey';

@Injectable()
export class UserResourceTransporter {
  public constructor(private readonly brokerService: BrokerService) {}

  public async createUserResource(payload: CreateUserResourcePayloadDto): Promise<CreateUserResourceResponseDto> {
    const data = this.brokerService.createRpcData(CreateUserResourcePayloadDto, payload);

    return this.brokerService.request(UserResourceRoutingKey.createUserResource, data);
  }

  public async findUserResource(payload: FindUserResourcePayloadDto): Promise<FindUserResourceResponseDto> {
    const data = this.brokerService.createRpcData(FindUserResourcePayloadDto, payload);

    return this.brokerService.request(UserResourceRoutingKey.findUserResource, data);
  }

  public async updateUserResource(payload: UpdateUserResourcePayloadDto): Promise<UpdateUserResourceResponseDto> {
    const data = this.brokerService.createRpcData(UpdateUserResourcePayloadDto, payload);

    return this.brokerService.request(UserResourceRoutingKey.updateUserResource, data);
  }

  public async removeUserResource(payload: RemoveUserResourcePayloadDto): Promise<void> {
    const data = this.brokerService.createRpcData(RemoveUserResourcePayloadDto, payload);

    return this.brokerService.request(UserResourceRoutingKey.removeUserResource, data);
  }
}
