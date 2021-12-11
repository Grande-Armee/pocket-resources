import { DomainError } from '@grande-armee/pocket-common';

export interface UserResourceTagNotFoundByIdsErrorContext {
  readonly userId: string;
  readonly resourceId: string;
  readonly tagId: string;
}

export class UserResourceTagNotFoundByIdsError extends DomainError<UserResourceTagNotFoundByIdsErrorContext> {
  public constructor(context: UserResourceTagNotFoundByIdsErrorContext) {
    super(`User resource tag with provided ids not found.`, context);
  }
}
