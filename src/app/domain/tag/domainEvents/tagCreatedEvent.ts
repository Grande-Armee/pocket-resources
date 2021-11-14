import { DomainEvent } from '../../../shared/domainEventsDispatcher/providers/domainEventsDispatcherFactory';

export interface TagCreatedEventPayload {
  readonly id: string;
}

export class TagCreatedEvent extends DomainEvent<TagCreatedEventPayload> {
  public readonly name = 'TAG_CREATED';
}
