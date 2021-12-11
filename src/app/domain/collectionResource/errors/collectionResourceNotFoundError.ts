import { DomainError } from '@grande-armee/pocket-common';

export interface CollectionResourceNotFoundErrorContext {
  readonly id: string;
}

export interface CollectionResourceNotFoundByCollectionAndResourceIdErrorContext {
  readonly collectionId: string;
  readonly resourceId: string;
}

export class CollectionResourceNotFoundError extends DomainError<
  CollectionResourceNotFoundErrorContext | CollectionResourceNotFoundByCollectionAndResourceIdErrorContext
> {
  public constructor(
    context: CollectionResourceNotFoundErrorContext | CollectionResourceNotFoundByCollectionAndResourceIdErrorContext,
  ) {
    super(`CollectionResource with provided params not found.`, context);
  }
}
