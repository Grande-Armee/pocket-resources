export class Nullable<V> {
  private readonly value: V | null;

  protected constructor(value: V) {
    this.value = value || null;
  }

  public static wrap<T>(value: T): Nullable<T> {
    return new Nullable(value);
  }

  public map<R>(callback: (value: V) => R): Nullable<R | null> {
    if (!this.value) {
      return new Nullable(null);
    }

    return new Nullable(callback(this.value));
  }

  public toValue(): V | null {
    return this.value || null;
  }
}
