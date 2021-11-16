import { EntityTestDataGenerator, NonNullableEntity } from '@grande-armee/pocket-common';
import { internet, lorem, datatype, date } from 'faker';

import { Tag } from '../entities/tag';

type TagTestData = NonNullableEntity<Omit<Tag, 'userResourceTags'>>;

export class TagTestDataGenerator implements EntityTestDataGenerator<TagTestData> {
  public generateEntityData(): TagTestData {
    return {
      id: this.generateId(),
      createdAt: this.generateCreatedAt(),
      updatedAt: this.generateUpdatedAt(),
      title: this.generateTitle(),
      color: this.generateColor(),
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

  public generateTitle(): string {
    return lorem.text(10);
  }

  public generateColor(): string {
    return internet.color();
  }

  public generateUserId(): string {
    return datatype.uuid();
  }
}
