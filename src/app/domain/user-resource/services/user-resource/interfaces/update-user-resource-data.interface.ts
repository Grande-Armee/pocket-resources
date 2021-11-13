import { UserResourceStatus } from '../../../entities/user-resource.entity';

export interface UpdateUserResourceData {
  readonly status?: UserResourceStatus;
  readonly isFavorite?: boolean;
  readonly rating?: number;
}
