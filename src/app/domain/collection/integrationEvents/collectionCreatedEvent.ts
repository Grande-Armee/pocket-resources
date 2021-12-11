import { IntegrationEvent } from '@grande-armee/pocket-common';

export interface CollectionCreatedEventPayload {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly title: string | null;
  readonly thumbnailUrl: string | null;
  readonly content: string | null;
  readonly userId: string;
}

export class CollectionCreatedEvent extends IntegrationEvent<CollectionCreatedEventPayload> {
  public readonly name = 'pocket.resources.collections.collectionCreated';
}
