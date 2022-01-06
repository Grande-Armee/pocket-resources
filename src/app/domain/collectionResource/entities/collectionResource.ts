import { Validator } from '@grande-armee/pocket-common';
import { IsUUID, IsOptional, IsDate } from 'class-validator';
import {
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  Unique,
  ManyToOne,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm';

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
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @IsDate()
  @IsOptional()
  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @IsDate()
  @IsOptional()
  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  @ManyToOne(() => Resource, (resource) => resource.collectionResources)
  public resource?: Resource;

  @IsUUID('4')
  @Column({ type: 'uuid' })
  public resourceId: string;

  @ManyToOne(() => Collection, (collection) => collection.collectionResources)
  public collection?: Collection;

  @IsUUID('4')
  @Column({ type: 'uuid' })
  public collectionId: string;

  @BeforeInsert()
  @BeforeUpdate()
  protected validate(): void {
    Validator.validate(this);
  }
}
