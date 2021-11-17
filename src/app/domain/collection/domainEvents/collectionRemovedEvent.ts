import { DomainEvent } from '@shared/domainEventsDispatcher/providers/domainEventsDispatcherFactory';

export interface CollectionRemovedEventPayload {
  readonly id: string;
}

export class CollectionRemovedEvent extends DomainEvent<CollectionRemovedEventPayload> {
  public readonly name = 'COLLECTION_REMOVED';
}
