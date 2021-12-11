import { IntegrationEvent, UserResourceStatus } from '@grande-armee/pocket-common';

import { ResourceDto } from '@domain/resource/dtos/resourceDto';
import { TagDto } from '@domain/tag/dtos/tagDto';

export interface UserResourceUpdatedEventPayload {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly status: UserResourceStatus;
  readonly isFavorite: boolean;
  readonly rating: number | null;
  readonly resource: ResourceDto | null;
  readonly resourceId: string;
  readonly userId: string;
  readonly tags: TagDto[] | null;
}

export class UserResourceUpdatedEvent extends IntegrationEvent<UserResourceUpdatedEventPayload> {
  public readonly name = 'pocket.resources.userResources.userResourceUpdated';
}
