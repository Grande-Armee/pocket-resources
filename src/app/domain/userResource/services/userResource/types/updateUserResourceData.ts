import { UserResourceStatus } from '@grande-armee/pocket-common';

export interface UpdateUserResourceData {
  readonly status?: UserResourceStatus;
  readonly isFavorite?: boolean;
  readonly rating?: number;
}
