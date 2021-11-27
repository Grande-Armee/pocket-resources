import { Expose } from 'class-transformer';

export class CollectionDto {
  @Expose()
  public id: string;
}
