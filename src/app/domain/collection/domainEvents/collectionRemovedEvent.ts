import { DomainEvent } from '@grande-armee/pocket-common';

export interface CollectionRemovedEventPayload {
  readonly id: string;
}

export class CollectionRemovedEvent extends DomainEvent<CollectionRemovedEventPayload> {
  public readonly name = 'COLLECTION_REMOVED';
}
