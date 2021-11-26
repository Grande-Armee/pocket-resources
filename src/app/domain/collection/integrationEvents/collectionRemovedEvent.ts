import { IntegrationEvent } from '@grande-armee/pocket-common';

export interface CollectionRemovedEventPayload {
  readonly id: string;
}

export class CollectionRemovedEvent extends IntegrationEvent<CollectionRemovedEventPayload> {
  public readonly name = 'COLLECTION_REMOVED';
}
