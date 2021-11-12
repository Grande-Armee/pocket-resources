import { DomainEvent } from '../../../shared/domain-events-dispatcher/providers/domain-events-dispatcher-factory';

export interface TagUpdatedEventPayload {
  readonly id: string;
}

export class TagUpdatedEvent extends DomainEvent<TagUpdatedEventPayload> {
  public readonly name = 'TAG_UPDATED';
}
