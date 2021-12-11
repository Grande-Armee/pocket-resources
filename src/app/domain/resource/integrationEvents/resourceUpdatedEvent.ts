import { IntegrationEvent } from '@grande-armee/pocket-common';

export interface ResourceUpdatedEventPayload {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly url: string;
  readonly title: string | null;
  readonly thumbnailUrl: string | null;
  readonly content: string | null;
}

export class ResourceUpdatedEvent extends IntegrationEvent<ResourceUpdatedEventPayload> {
  public readonly name = 'pocket.resources.resources.resourceUpdated';
}
