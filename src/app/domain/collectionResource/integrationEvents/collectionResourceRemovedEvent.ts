import { IntegrationEvent } from '@grande-armee/pocket-common';

export interface CollectionResourceRemovedEventPayload {
  readonly id: string;
}

export class CollectionResourceRemovedEvent extends IntegrationEvent<CollectionResourceRemovedEventPayload> {
  public readonly name = 'pocket.resources.collectionResources.collectionResourceRemoved';
}