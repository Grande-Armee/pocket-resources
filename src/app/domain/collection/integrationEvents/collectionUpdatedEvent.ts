import { IntegrationEvent } from '@grande-armee/pocket-common';

import { ResourceDto } from '@domain/resource/dtos/resourceDto';

export interface CollectionUpdatedEventPayload {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly title: string | null;
  readonly thumbnailUrl: string | null;
  readonly content: string | null;
  readonly userId: string;
  readonly resources?: ResourceDto[] | null;
}

export class CollectionUpdatedEvent extends IntegrationEvent<CollectionUpdatedEventPayload> {
  public readonly name = 'pocket.resources.collections.collectionUpdated';
}
