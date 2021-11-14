import { DomainEvent } from '@shared/domainEventsDispatcher/providers/domainEventsDispatcherFactory';

export interface TagUpdatedEventPayload {
  readonly id: string;
}

export class TagUpdatedEvent extends DomainEvent<TagUpdatedEventPayload> {
  public readonly name = 'TAG_UPDATED';
}
