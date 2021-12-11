import { DomainError } from '@grande-armee/pocket-common';

export interface UserResourceTagNotFoundErrorContext {
  readonly id: string;
}

export interface UserResourceTagNotFoundByIdsErrorContext {
  readonly userId: string;
  readonly resourceId: string;
  readonly tagId: string;
}

export class UserResourceTagNotFoundError extends DomainError<
  UserResourceTagNotFoundErrorContext | UserResourceTagNotFoundByIdsErrorContext
> {
  public constructor(context: UserResourceTagNotFoundErrorContext | UserResourceTagNotFoundByIdsErrorContext) {
    super(`UserResourceTag with provided params not found.`, context);
  }
}
