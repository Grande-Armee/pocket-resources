import { IntegrationEvent } from '@grande-armee/pocket-common';

export interface TagCreatedEventPayload {
  readonly id: string;
}

export class TagCreatedEvent extends IntegrationEvent<TagCreatedEventPayload> {
  public readonly name = 'TAG_CREATED';
}
