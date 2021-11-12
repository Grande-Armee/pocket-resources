import { DomainEvent } from '../../../shared/domain-events-dispatcher/providers/domain-events-dispatcher-factory';

export interface TagRemovedEventPayload {
  readonly id: string;
}

export class TagRemovedEvent extends DomainEvent<TagRemovedEventPayload> {
  public readonly name = 'TAG_REMOVED';
}
