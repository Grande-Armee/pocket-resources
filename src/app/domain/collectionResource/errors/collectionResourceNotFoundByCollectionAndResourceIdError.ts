import { DomainError } from '@grande-armee/pocket-common';

export interface CollectionResourceNotFoundByCollectionAndResourceIdErrorContext {
  readonly collectionId: string;
  readonly resourceId: string;
}

export class CollectionResourceNotFoundByCollectionAndResourceIdError extends DomainError<CollectionResourceNotFoundByCollectionAndResourceIdErrorContext> {
  public constructor(context: CollectionResourceNotFoundByCollectionAndResourceIdErrorContext) {
    super(`Collection resource with provided collectionId and resourceId not found.`, context);
  }
}
