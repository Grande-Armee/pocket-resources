import { IntegrationEvent, UserResourceStatus } from '@grande-armee/pocket-common';

export interface UserResourceUpdatedEventPayload {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly status: UserResourceStatus;
  readonly isFavorite: boolean;
  readonly rating: number | null;
  readonly resourceId: string;
  readonly userId: string;
}

export class UserResourceUpdatedEvent extends IntegrationEvent<UserResourceUpdatedEventPayload> {
  public readonly name = 'pocket.resources.userResources.userResourceUpdated';
}
