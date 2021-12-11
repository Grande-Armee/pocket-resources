import { IntegrationEvent } from '@grande-armee/pocket-common';

export interface TagCreatedEventPayload {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly color: string;
  readonly title: string;
  readonly userId: string;
}

export class TagCreatedEvent extends IntegrationEvent<TagCreatedEventPayload> {
  public readonly name = 'pocket.resources.tags.tagCreated';
}
