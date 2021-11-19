import { DomainEvent } from '@grande-armee/pocket-common';

export interface ResourceUpdatedEventPayload {
  readonly id: string;
}

export class ResourceUpdatedEvent extends DomainEvent<ResourceUpdatedEventPayload> {
  public readonly name = 'RESOURCE_UPDATED';
}
