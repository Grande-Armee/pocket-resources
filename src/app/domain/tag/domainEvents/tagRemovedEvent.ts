import { DomainEvent } from '../../../shared/domainEventsDispatcher/providers/domainEventsDispatcherFactory';

export interface TagRemovedEventPayload {
  readonly id: string;
}

export class TagRemovedEvent extends DomainEvent<TagRemovedEventPayload> {
  public readonly name = 'TAG_REMOVED';
}
