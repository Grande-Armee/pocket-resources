import { DomainEvent } from '@grande-armee/pocket-common';

export interface TagRemovedEventPayload {
  readonly id: string;
}

export class TagRemovedEvent extends DomainEvent<TagRemovedEventPayload> {
  public readonly name = 'TAG_REMOVED';
}
