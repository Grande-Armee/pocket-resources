import { IntegrationEvent } from '@grande-armee/pocket-common';

export interface CollectionUpdatedEventPayload {
  readonly id: string;
}

export class CollectionUpdatedEvent extends IntegrationEvent<CollectionUpdatedEventPayload> {
  public readonly name = 'COLLECTION_UPDATED';
}
