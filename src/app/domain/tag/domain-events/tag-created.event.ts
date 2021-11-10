import { DomainEvent } from '../../../shared/domain-events-dispatcher/providers/domain-events-dispatcher-factory';

export interface TagCreatedEventPayload {
  readonly id: string;
}

export class TagCreatedEvent extends DomainEvent<TagCreatedEventPayload> {
  public readonly name = 'TAG_CREATED';
}
