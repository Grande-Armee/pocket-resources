import { IntegrationEvent } from '@grande-armee/pocket-common';

export interface CollectionUpdatedEventPayload {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly title: string | null;
  readonly thumbnailUrl: string | null;
  readonly content: string | null;
  readonly userId: string;
}

export class CollectionUpdatedEvent extends IntegrationEvent<CollectionUpdatedEventPayload> {
  public readonly name = 'pocket.resources.collections.collectionUpdated';
}
