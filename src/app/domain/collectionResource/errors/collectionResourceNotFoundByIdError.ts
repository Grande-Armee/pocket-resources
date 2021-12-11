import { DomainError } from '@grande-armee/pocket-common';

export interface CollectionResourceNotFoundByIdErrorContext {
  readonly id: string;
}

export class CollectionResourceNotFoundByIdError extends DomainError<CollectionResourceNotFoundByIdErrorContext> {
  public constructor(context: CollectionResourceNotFoundByIdErrorContext) {
    super(`Collection resource with provided id not found.`, context);
  }
}
