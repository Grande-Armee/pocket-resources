import { IntegrationEvent } from '@grande-armee/pocket-common';

export interface UserResourceRemovedEventPayload {
  readonly id: string;
}

export class UserResourceRemovedEvent extends IntegrationEvent<UserResourceRemovedEventPayload> {
  public readonly name = 'pocket.resources.userResources.userResourceRemoved';
}
