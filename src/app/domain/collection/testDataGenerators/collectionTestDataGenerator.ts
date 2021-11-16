import { EntityTestDataGenerator, NonNullableEntity } from '@grande-armee/pocket-common';
import { internet, lorem, datatype, date } from 'faker';

import { Collection } from '../entities/collection';

type CollectionTestData = NonNullableEntity<Collection>;

export class CollectionTestDataGenerator implements EntityTestDataGenerator<CollectionTestData> {
  public generateEntityData(): CollectionTestData {
    return {
      id: this.generateId(),
      createdAt: this.generateCreatedAt(),
      updatedAt: this.generateUpdatedAt(),
      title: this.generateTitle(),
      content: this.generateContent(),
      thumbnailUrl: this.generateThumbnailUrl(),
      userId: this.generateId(),
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

  public generateTitle(): string {
    return lorem.text(10);
  }

  public generateContent(): string {
    return lorem.text(30);
  }

  public generateThumbnailUrl(): string {
    return internet.url();
  }

  public generateUserId(): string {
    return datatype.uuid();
  }
}
