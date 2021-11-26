import { IntegrationEvent } from '@grande-armee/pocket-common';

export interface TagUpdatedEventPayload {
  readonly id: string;
}

export class TagUpdatedEvent extends IntegrationEvent<TagUpdatedEventPayload> {
  public readonly name = 'TAG_UPDATED';
}
