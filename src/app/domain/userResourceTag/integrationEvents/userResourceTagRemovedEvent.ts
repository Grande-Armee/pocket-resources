import { IntegrationEvent } from '@grande-armee/pocket-common';

export interface UserResourceTagRemovedEventPayload {
  readonly id: string;
}

export class UserResourceTagRemovedEvent extends IntegrationEvent<UserResourceTagRemovedEventPayload> {
  public readonly name = 'pocket.resources.userResourceTags.userResourceTagRemoved';
}
