import { IntegrationEvent } from '@grande-armee/pocket-common';

export interface ResourceUpdatedEventPayload {
  readonly id: string;
}

export class ResourceUpdatedEvent extends IntegrationEvent<ResourceUpdatedEventPayload> {
  public readonly name = 'RESOURCE_UPDATED';
}
