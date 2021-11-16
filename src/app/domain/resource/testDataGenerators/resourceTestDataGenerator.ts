import { EntityTestDataGenerator, NonNullableEntity } from '@grande-armee/pocket-common';
import { internet, lorem, datatype, date } from 'faker';

import { Resource } from '../entities/resource';

type ResourceTestData = NonNullableEntity<Omit<Resource, 'userResources'>>;

export class ResourceTestDataGenerator implements EntityTestDataGenerator<ResourceTestData> {
  public generateEntityData(): ResourceTestData {
    return {
      id: this.generateId(),
      createdAt: this.generateCreatedAt(),
      updatedAt: this.generateUpdatedAt(),
      url: this.generateUrl(),
      title: this.generateTitle(),
      content: this.generateContent(),
      thumbnailUrl: this.generateThumbnailUrl(),
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

  public generateUrl(): string {
    return internet.url();
  }

  public generateThumbnailUrl(): string {
    return internet.url();
  }
}
