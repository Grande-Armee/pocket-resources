import { DomainEvent } from '@grande-armee/pocket-common';

export interface ResourceRemovedEventPayload {
  readonly id: string;
}

export class ResourceRemovedEvent extends DomainEvent<ResourceRemovedEventPayload> {
  public readonly name = 'RESOURCE_REMOVED';
}
