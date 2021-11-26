import { IntegrationEvent } from '@grande-armee/pocket-common';

export interface CollectionCreatedEventPayload {
  readonly id: string;
}

export class CollectionCreatedEvent extends IntegrationEvent<CollectionCreatedEventPayload> {
  public readonly name = 'COLLECTION_CREATED';
}
