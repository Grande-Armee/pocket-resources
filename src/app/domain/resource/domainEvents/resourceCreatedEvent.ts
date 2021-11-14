import { DomainEvent } from '../../../shared/domainEventsDispatcher/providers/domainEventsDispatcherFactory';

export interface ResourceCreatedEventPayload {
  readonly id: string;
}

export class ResourceCreatedEvent extends DomainEvent<ResourceCreatedEventPayload> {
  public readonly name = 'RESOURCE_CREATED';
}
