import { DomainEvent } from '@grande-armee/pocket-common';

export interface CollectionUpdatedEventPayload {
  readonly id: string;
}

export class CollectionUpdatedEvent extends DomainEvent<CollectionUpdatedEventPayload> {
  public readonly name = 'COLLECTION_UPDATED';
}
