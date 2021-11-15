import { datatype, date } from 'faker';

import { EntityTestDataGenerator, NonNullableEntity } from '@shared/testDataGenerator/testDataGenerator';

import { UserResourceTag } from '../entities/userResourceTag';

type UserResourceTagTestData = NonNullableEntity<Omit<UserResourceTag, 'userResource' | 'tag'>>;

export class UserResourceTagTestDataGenerator implements EntityTestDataGenerator<UserResourceTagTestData> {
  public generateEntityData(): UserResourceTagTestData {
    return {
      id: this.generateId(),
      createdAt: this.generateCreatedAt(),
      updatedAt: this.generateUpdatedAt(),
      userResourceId: this.generateUserResourceId(),
      tagId: this.generateTagId(),
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

  public generateUserResourceId(): string {
    return datatype.uuid();
  }

  public generateTagId(): string {
    return datatype.uuid();
  }
}
