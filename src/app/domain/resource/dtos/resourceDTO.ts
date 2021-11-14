import { ClassConstructor, Expose, plainToClass } from 'class-transformer';

// TODO: move to common
function createDTOFactory<T>(type: ClassConstructor<T>) {
  return (params: T): T => {
    return plainToClass(type, params, { excludeExtraneousValues: true });
  };
}

export class ResourceDTO {
  @Expose()
  public readonly id: string;

  @Expose()
  public readonly createdAt: Date;

  @Expose()
  public readonly updatedAt: Date;

  @Expose()
  public readonly url: string;

  @Expose()
  public readonly title: string | null;

  @Expose()
  public readonly thumbnailUrl: string | null;

  @Expose()
  public readonly content: string | null;

  public static create = createDTOFactory(ResourceDTO);
}
