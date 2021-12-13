import { IntegrationEvent, UserResourceStatus } from '@grande-armee/pocket-common';

export interface UserResourceCreatedEventPayload {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly status: UserResourceStatus;
  readonly isFavorite: boolean;
  readonly rating: number | null;
  readonly resourceId: string;
  readonly userId: string;
}

export class UserResourceCreatedEvent extends IntegrationEvent<UserResourceCreatedEventPayload> {
  public readonly name = 'pocket.resources.userResources.userResourceCreated';
}
