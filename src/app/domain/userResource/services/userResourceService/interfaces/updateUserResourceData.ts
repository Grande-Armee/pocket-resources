import { UserResourceStatus } from '../../../entities/userResource';

export interface UpdateUserResourceData {
  readonly status?: UserResourceStatus;
  readonly isFavorite?: boolean;
  readonly rating?: number;
}
