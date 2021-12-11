import { IntegrationEvent } from '@grande-armee/pocket-common';

export interface TagUpdatedEventPayload {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly color: string;
  readonly title: string;
  readonly userId: string;
}

export class TagUpdatedEvent extends IntegrationEvent<TagUpdatedEventPayload> {
  public readonly name = 'pocket.resources.tags.tagUpdated';
}
