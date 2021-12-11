import { IntegrationEvent } from '@grande-armee/pocket-common';

export interface CollectionResourceCreatedEventPayload {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly collectionId: string;
  readonly resourceId: string;
}

export class CollectionResourceCreatedEvent extends IntegrationEvent<CollectionResourceCreatedEventPayload> {
  public readonly name = 'pocket.resources.collectionResources.collectionResourceCreated';
}
