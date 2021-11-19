import { DomainEvent } from '@grande-armee/pocket-common';

export interface TagCreatedEventPayload {
  readonly id: string;
}

export class TagCreatedEvent extends DomainEvent<TagCreatedEventPayload> {
  public readonly name = 'TAG_CREATED';
}
