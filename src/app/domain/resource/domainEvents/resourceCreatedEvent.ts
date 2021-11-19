import { DomainEvent } from '@grande-armee/pocket-common';

export interface ResourceCreatedEventPayload {
  readonly id: string;
}

export class ResourceCreatedEvent extends DomainEvent<ResourceCreatedEventPayload> {
  public readonly name = 'RESOURCE_CREATED';
}
