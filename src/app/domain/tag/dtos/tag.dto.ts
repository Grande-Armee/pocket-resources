import { ClassConstructor, Expose, plainToClass } from 'class-transformer';

// TODO: move to common
function createDTOFactory<T>(type: ClassConstructor<T>) {
  return (params: T): T => {
    return plainToClass(type, params, { excludeExtraneousValues: true });
  };
}

export class TagDTO {
  @Expose()
  public readonly id: string;

  @Expose()
  public readonly createdAt: Date;

  @Expose()
  public readonly updatedAt: Date;

  public static create = createDTOFactory(TagDTO);
}
