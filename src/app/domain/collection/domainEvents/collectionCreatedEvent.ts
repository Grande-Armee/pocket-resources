import { DomainEvent } from '@grande-armee/pocket-common';

export interface CollectionCreatedEventPayload {
  readonly id: string;
}

export class CollectionCreatedEvent extends DomainEvent<CollectionCreatedEventPayload> {
  public readonly name = 'COLLECTION_CREATED';
}
