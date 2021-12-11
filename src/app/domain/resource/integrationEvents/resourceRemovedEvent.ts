import { IntegrationEvent } from '@grande-armee/pocket-common';

export interface ResourceRemovedEventPayload {
  readonly id: string;
}

export class ResourceRemovedEvent extends IntegrationEvent<ResourceRemovedEventPayload> {
  public readonly name = 'pocket.resources.resources.resourceRemoved';
}
