import { DomainError } from '@grande-armee/pocket-common';

export interface ResourceNotFoundErrorContext {
  readonly id: string;
}

export class ResourceNotFoundError extends DomainError<ResourceNotFoundErrorContext> {
  public constructor(context: ResourceNotFoundErrorContext) {
    super(`Resource with the provided id not found.`, context);
  }
}
