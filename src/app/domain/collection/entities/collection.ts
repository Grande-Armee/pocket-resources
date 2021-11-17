import { Expose } from 'class-transformer';
import { IsUUID, IsOptional, IsDate, IsString, IsUrl } from 'class-validator';
import { Entity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, Column, OneToMany } from 'typeorm';

import { CollectionResource } from '@domain/collectionResource/entities/collectionResource';

export const COLLECTION_TABLE_NAME = 'collections';

@Entity({
  name: COLLECTION_TABLE_NAME,
})
export class Collection {
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

  @IsString()
  @Expose()
  @Column({ type: 'text', nullable: true })
  public title: string | null;

  @IsString()
  @IsUrl()
  @Expose()
  @Column({ type: 'text', nullable: true })
  public thumbnailUrl: string | null;

  @IsString()
  @Expose()
  @Column({ type: 'text', nullable: true })
  public content: string | null;

  @IsUUID('4')
  @Expose()
  @Column({ type: 'uuid' })
  public userId: string;

  @Expose()
  @OneToMany(() => CollectionResource, (collectionResource) => collectionResource.collection)
  public collectionResources?: CollectionResource[];
}
