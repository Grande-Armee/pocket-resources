import { IntegrationEvent } from '@grande-armee/pocket-common';

export interface ResourceCreatedEventPayload {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly url: string;
  readonly title: string | null;
  readonly thumbnailUrl: string | null;
  readonly content: string | null;
}

export class ResourceCreatedEvent extends IntegrationEvent<ResourceCreatedEventPayload> {
  public readonly name = 'pocket.resources.resources.resourceCreated';
}
