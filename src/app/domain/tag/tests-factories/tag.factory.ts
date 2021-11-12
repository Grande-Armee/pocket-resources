import { internet, lorem, datatype } from 'faker';

export class TagTestFactory {
  public static createTitle(): string {
    return lorem.text(10);
  }

  public static createColor(): string {
    return internet.color();
  }

  public static createUserId(): string {
    return datatype.uuid();
  }
}
