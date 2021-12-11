import { DomainError } from '@grande-armee/pocket-common';

export interface UserResourceTagNotFoundByIdErrorContext {
  readonly id: string;
}

export class UserResourceTagNotFoundByIdError extends DomainError<UserResourceTagNotFoundByIdErrorContext> {
  public constructor(context: UserResourceTagNotFoundByIdErrorContext) {
    super(`User resource tag with the provided id not found.`, context);
  }
}
