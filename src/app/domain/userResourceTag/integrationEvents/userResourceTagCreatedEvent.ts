import { IntegrationEvent } from '@grande-armee/pocket-common';

export interface UserResourceTagCreatedEventPayload {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly userResourceId: string;
  readonly tagId: string;
}

export class UserResourceTagCreatedEvent extends IntegrationEvent<UserResourceTagCreatedEventPayload> {
  public readonly name = 'pocket.resources.userResourceTags.userResourceTagCreated';
}
