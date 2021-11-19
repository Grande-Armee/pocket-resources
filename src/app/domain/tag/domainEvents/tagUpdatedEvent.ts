import { DomainEvent } from '@grande-armee/pocket-common';

export interface TagUpdatedEventPayload {
  readonly id: string;
}

export class TagUpdatedEvent extends DomainEvent<TagUpdatedEventPayload> {
  public readonly name = 'TAG_UPDATED';
}
