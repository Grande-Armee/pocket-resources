import { DomainError } from '@grande-armee/pocket-common';

export interface CollectionNotFoundErrorContext {
  readonly id: string;
}

export class CollectionNotFoundError extends DomainError<CollectionNotFoundErrorContext> {
  public constructor(context: CollectionNotFoundErrorContext) {
    super(`Collection with the provided id not found.`, context);
  }
}
