import { DomainError } from '@grande-armee/pocket-common';

export interface UserResourceNotFoundByUserAndResourceIdErrorContext {
  readonly userId: string;
  readonly resourceId: string;
}

export class UserResourceNotFoundByUserAndResourceIdError extends DomainError<UserResourceNotFoundByUserAndResourceIdErrorContext> {
  public constructor(context: UserResourceNotFoundByUserAndResourceIdErrorContext) {
    super(`User resource with provided userId and resourceId not found.`, context);
  }
}
