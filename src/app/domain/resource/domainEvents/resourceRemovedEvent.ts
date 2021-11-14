import { DomainEvent } from '@shared/domainEventsDispatcher/providers/domainEventsDispatcherFactory';

export interface ResourceRemovedEventPayload {
  readonly id: string;
}

export class ResourceRemovedEvent extends DomainEvent<ResourceRemovedEventPayload> {
  public readonly name = 'RESOURCE_REMOVED';
}
