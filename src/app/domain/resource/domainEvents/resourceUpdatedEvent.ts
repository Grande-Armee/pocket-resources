import { DomainEvent } from '@shared/domainEventsDispatcher/providers/domainEventsDispatcherFactory';

export interface ResourceUpdatedEventPayload {
  readonly id: string;
}

export class ResourceUpdatedEvent extends DomainEvent<ResourceUpdatedEventPayload> {
  public readonly name = 'RESOURCE_UPDATED';
}
