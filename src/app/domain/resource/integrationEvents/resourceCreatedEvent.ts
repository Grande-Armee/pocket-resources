import { IntegrationEvent } from '@grande-armee/pocket-common';

export interface ResourceCreatedEventPayload {
  readonly id: string;
}

export class ResourceCreatedEvent extends IntegrationEvent<ResourceCreatedEventPayload> {
  public readonly name = 'RESOURCE_CREATED';
}
