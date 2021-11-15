import { UserResourceStatus } from '../../../entities/types/userResourceStatus';

export interface UpdateUserResourceData {
  readonly status?: UserResourceStatus;
  readonly isFavorite?: boolean;
  readonly rating?: number;
}
