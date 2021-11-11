import { DomainEvent } from '../../../shared/domain-events-dispatcher/providers/domain-events-dispatcher-factory';

export interface ResourceRemovedEventPayload {
  readonly id: string;
}

export class ResourceRemovedEvent extends DomainEvent<ResourceRemovedEventPayload> {
  public readonly name = 'RESOURCE_REMOVED';
}
