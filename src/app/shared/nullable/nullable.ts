export class Nullable<V> {
  private readonly value: V | null;

  protected constructor(value: V | null) {
    this.value = value;
  }

  public static wrap<T>(optionalValue?: T): Nullable<T> {
    return new Nullable(optionalValue || null);
  }

  public map<R>(callback: (value: V) => R): Nullable<R> {
    if (!this.value) {
      return new Nullable(null) as any; // TODO: fix types
    }

    return new Nullable(callback(this.value));
  }

  public toValue(): V | null {
    return this.value || null;
  }
}
