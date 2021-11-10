import { DomainEvent } from '../../../shared/domain-events-dispatcher/providers/domain-events-dispatcher-factory';

export interface ResourceCreatedEventPayload {
  readonly id: string;
}

export class ResourceCreatedEvent extends DomainEvent<ResourceCreatedEventPayload> {
  public readonly name = 'RESOURCE_CREATED';
}
