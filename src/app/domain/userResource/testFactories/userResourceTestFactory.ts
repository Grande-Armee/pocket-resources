import { helpers, datatype } from 'faker';

import { UserResourceStatus } from '../entities/userResource';

export class UserResourceTestFactory {
  public static createStatus(): UserResourceStatus {
    return helpers.randomize([UserResourceStatus.toRead, UserResourceStatus.inArchive, UserResourceStatus.inTrash]);
  }

  public static createIsFavorite(): boolean {
    return datatype.boolean();
  }

  public static createRating(): number {
    return datatype.number({
      min: 1,
      max: 5,
    });
  }

  public static createResourceId(): string {
    return datatype.uuid();
  }

  public static createUserId(): string {
    return datatype.uuid();
  }

  public static createUserResourceId(): string {
    return datatype.uuid();
  }
}
