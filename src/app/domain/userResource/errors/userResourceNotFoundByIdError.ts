import { DomainError } from '@grande-armee/pocket-common';

export interface UserResourceNotFoundByIdErrorContext {
  readonly id: string;
}

export class UserResourceNotFoundByIdError extends DomainError<UserResourceNotFoundByIdErrorContext> {
  public constructor(context: UserResourceNotFoundByIdErrorContext) {
    super(`User resource with the provided id not found.`, context);
  }
}
