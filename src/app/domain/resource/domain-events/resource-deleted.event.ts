import { DomainEvent } from '../../../shared/domain-events-dispatcher/providers/domain-events-dispatcher-factory';

export interface ResourceDeletedEventPayload {
  readonly id: string;
}

export class ResourceDeletedEvent extends DomainEvent<ResourceDeletedEventPayload> {
  public readonly name = 'RESOURCE_DELETED';
}
