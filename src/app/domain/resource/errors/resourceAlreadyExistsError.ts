import { DomainError } from '@grande-armee/pocket-common';

export interface ResourceAlreadyExistsErrorContext {
  readonly url: string;
}

export class ResourceAlreadyExistsError extends DomainError<ResourceAlreadyExistsErrorContext> {
  public constructor(context: ResourceAlreadyExistsErrorContext) {
    super(`Resource with the provided url already exists.`, context);
  }
}
