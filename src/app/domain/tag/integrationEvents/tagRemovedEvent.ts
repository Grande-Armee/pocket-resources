import { IntegrationEvent } from '@grande-armee/pocket-common';

export interface TagRemovedEventPayload {
  readonly id: string;
}

export class TagRemovedEvent extends IntegrationEvent<TagRemovedEventPayload> {
  public readonly name = 'pocket.resources.tags.tagRemoved';
}
