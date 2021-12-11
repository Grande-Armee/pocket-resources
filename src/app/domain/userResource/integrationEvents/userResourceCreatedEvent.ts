import { IntegrationEvent, UserResourceStatus } from '@grande-armee/pocket-common';

import { ResourceDto } from '@domain/resource/dtos/resourceDto';

export interface UserResourceCreatedEventPayload {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly status: UserResourceStatus;
  readonly isFavorite: boolean;
  readonly rating: number | null;
  readonly resource: ResourceDto | null;
  readonly resourceId: string;
  readonly userId: string;
}

export class UserResourceCreatedEvent extends IntegrationEvent<UserResourceCreatedEventPayload> {
  public readonly name = 'pocket.resources.userResources.userResourceCreated';
}
