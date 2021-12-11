import { DomainError } from '@grande-armee/pocket-common';

export interface TagNotFoundErrorContext {
  readonly id: string;
}

export class TagNotFoundError extends DomainError<TagNotFoundErrorContext> {
  public constructor(context: TagNotFoundErrorContext) {
    super(`Tag with the provided id not found.`, context);
  }
}
