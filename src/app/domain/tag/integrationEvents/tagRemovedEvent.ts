import { IntegrationEvent } from '@grande-armee/pocket-common';

export interface TagRemovedEventPayload {
  readonly id: string;
}

export class TagRemovedEvent extends IntegrationEvent<TagRemovedEventPayload> {
  public readonly name = 'TAG_REMOVED';
}
