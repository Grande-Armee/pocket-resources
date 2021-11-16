import { Expose } from 'class-transformer';
import { IsUUID, IsOptional, IsDate } from 'class-validator';
import { Entity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, Column, Unique, ManyToOne } from 'typeorm';

// import { Collection } from '@domain/collection/entities/collection';
import { Resource } from '@domain/resource/entities/resource';

import { Collection } from '../../collection/entities/collection';

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

  @Expose()
  @ManyToOne(() => Resource, (resource) => resource.collectionResources)
  public resource?: Resource;

  @IsUUID('4')
  @Expose()
  @Column({ type: 'uuid' })
  public resourceId: string;

  @Expose()
  @ManyToOne(() => Collection, (collection) => collection.id)
  public collection?: Collection;

  @IsUUID('4')
  @Expose()
  @Column({ type: 'uuid' })
  public collectionId: string;
}
