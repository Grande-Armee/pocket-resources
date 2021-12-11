import { DomainError } from '@grande-armee/pocket-common';

export interface UserResourceNotFoundErrorContext {
  readonly id: string;
}

export interface UserResourceNotFoundByUserAndResourceIdErrorContext {
  readonly userId: string;
  readonly resourceId: string;
}

export class UserResourceNotFoundError extends DomainError<
  UserResourceNotFoundErrorContext | UserResourceNotFoundByUserAndResourceIdErrorContext
> {
  public constructor(context: UserResourceNotFoundErrorContext | UserResourceNotFoundByUserAndResourceIdErrorContext) {
    super(`UserResource with provided params not found.`, context);
  }
}
