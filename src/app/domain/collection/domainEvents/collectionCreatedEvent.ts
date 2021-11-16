import { DomainEvent } from '@shared/domainEventsDispatcher/providers/domainEventsDispatcherFactory';

export interface CollectionCreatedEventPayload {
  readonly id: string;
}

export class CollectionCreatedEvent extends DomainEvent<CollectionCreatedEventPayload> {
  public readonly name = 'COLLECTION_CREATED';
}
