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

  @IsString()
  @Column({ type: 'text' })
  public title: string;

  @IsString()
  @IsUrl()
  @Column({ type: 'text', nullable: true })
  public thumbnailUrl: string | null;

  @IsString()
  @Column({ type: 'text', nullable: true })
  public content: string | null;

  @IsUUID('4')
  @Column({ type: 'uuid' })
  public userId: string;

  @OneToMany(() => CollectionResource, (collectionResource) => collectionResource.collection)
  public collectionResources?: CollectionResource[];
}
