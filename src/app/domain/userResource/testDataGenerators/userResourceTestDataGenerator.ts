import { EntityTestDataGenerator, NonNullableEntity } from '@grande-armee/pocket-common';
import { helpers, datatype, date } from 'faker';

import { UserResourceStatus } from '../entities/types/userResourceStatus';
import { UserResource } from '../entities/userResource';

type UserResourceTestData = NonNullableEntity<Omit<UserResource, 'resource' | 'userResourceTags'>>;

export class UserResourceTestDataGenerator implements EntityTestDataGenerator<UserResourceTestData> {
  public generateEntityData(): UserResourceTestData {
    return {
      id: this.generateId(),
      createdAt: this.generateCreatedAt(),
      updatedAt: this.generateUpdatedAt(),
      rating: this.generateRating(),
      isFavorite: this.generateIsFavorite(),
      status: this.generateStatus(),
      resourceId: this.generateResourceId(),
      userId: this.generateUserId(),
    };
  }

  public generateId(): string {
    return datatype.uuid();
  }

  public generateCreatedAt(): Date {
    return date.recent(3);
  }

  public generateUpdatedAt(): Date {
    return date.recent(1);
  }

  public generateRating(): number {
    return datatype.number({
      min: 1,
      max: 5,
    });
  }

  public generateIsFavorite(): boolean {
    return datatype.boolean();
  }

  public generateStatus(): UserResourceStatus {
    return helpers.randomize([UserResourceStatus.toRead, UserResourceStatus.inArchive, UserResourceStatus.inTrash]);
  }

  public generateResourceId(): string {
    return datatype.uuid();
  }

  public generateUserId(): string {
    return datatype.uuid();
  }
}
