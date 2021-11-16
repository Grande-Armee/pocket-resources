import { Expose } from 'class-transformer';
import { IsUUID, IsOptional, IsDate } from 'class-validator';
import { Entity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, Column, Unique } from 'typeorm';

// import { Collection } from '@domain/collection/entities/collection';
// import { Resource } from '@domain/resource/entities/resource';

export const COLLECTION_RESOURCE_TABLE_NAME = 'collectionResources';

@Unique('UQ_collectionId_resourceId', ['collectionId', 'resourceId'])
@Entity({
  name: COLLECTION_RESOURCE_TABLE_NAME,
})
export class CollectionResource {
  @IsUUID('4')
  @IsOptional()
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @IsDate()
  @IsOptional()
  @Expose()
  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @IsDate()
  @IsOptional()
  @Expose()
  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  // @Expose()
  // @ManyToOne(() => Collection, (collection) => userResource.userResourceTags)
  // public userResource?: UserResource;

  @IsUUID('4')
  @Expose()
  @Column({ type: 'uuid' })
  public collectionId: string;

  // @Expose()
  // @ManyToOne(() => Tag, (tag) => tag.id)
  // public tag?: Tag;

  @IsUUID('4')
  @Expose()
  @Column({ type: 'uuid' })
  public resourceId: string;
}
