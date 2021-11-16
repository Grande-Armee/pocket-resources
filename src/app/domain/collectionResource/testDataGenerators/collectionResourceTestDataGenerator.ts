import { EntityTestDataGenerator, NonNullableEntity } from '@grande-armee/pocket-common';
import { datatype, date } from 'faker';

import { CollectionResource } from '../entities/collectionResource';

type CollectionResourceTestData = NonNullableEntity<CollectionResource>;

export class CollectionResourceTestDataGenerator implements EntityTestDataGenerator<CollectionResourceTestData> {
  public generateEntityData(): CollectionResourceTestData {
    return {
      id: this.generateId(),
      createdAt: this.generateCreatedAt(),
      updatedAt: this.generateUpdatedAt(),
      collectionId: this.generateCollectionId(),
      resourceId: this.generateResourceId(),
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

  public generateCollectionId(): string {
    return datatype.uuid();
  }

  public generateResourceId(): string {
    return datatype.uuid();
  }
}
