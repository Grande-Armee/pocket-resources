import { DomainEvent } from '../../../shared/domain-events-dispatcher/providers/domain-events-dispatcher-factory';

export interface ResourceUpdatedEventPayload {
  readonly id: string;
}

export class ResourceUpdatedEvent extends DomainEvent<ResourceUpdatedEventPayload> {
  public readonly name = 'RESOURCE_UPDATED';
}
