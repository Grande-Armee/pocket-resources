import { IntegrationEvent } from '@grande-armee/pocket-common';

import { ResourceDto } from '@domain/resource/dtos/resourceDto';

export interface CollectionCreatedEventPayload {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly title: string | null;
  readonly thumbnailUrl: string | null;
  readonly content: string | null;
  readonly userId: string;
  readonly resources?: ResourceDto[] | null;
}

export class CollectionCreatedEvent extends IntegrationEvent<CollectionCreatedEventPayload> {
  public readonly name = 'pocket.resources.collections.collectionCreated';
}
