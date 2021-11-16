import { DomainEvent } from '@shared/domainEventsDispatcher/providers/domainEventsDispatcherFactory';

export interface CollectionUpdatedEventPayload {
  readonly id: string;
}

export class CollectionUpdatedEvent extends DomainEvent<CollectionUpdatedEventPayload> {
  public readonly name = 'COLLECTION_UPDATED';
}
