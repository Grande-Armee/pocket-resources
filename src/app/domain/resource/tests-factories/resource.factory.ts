import { internet, lorem } from 'faker';

export class ResourceTestFactory {
  public static createTitle(): string {
    return lorem.text(10);
  }

  public static createContent(): string {
    return lorem.text(30);
  }

  public static createUrl(): string {
    return internet.url();
  }

  public static createId(): string {
    return internet.password(12);
  }
}
