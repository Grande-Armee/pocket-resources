import { Validator } from '@grande-armee/pocket-common';
import { IsUUID, IsOptional, IsDate, IsString, IsUrl } from 'class-validator';
import {
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm';

import { CollectionResource } from '@domain/collectionResource/entities/collectionResource';

export const COLLECTION_TABLE_NAME = 'collections';

@Entity({
  name: COLLECTION_TABLE_NAME,
})
export class Collection {
  @IsOptional()
  @IsUUID('4')
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @IsOptional()
  @IsDate()
  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @IsOptional()
  @IsDate()
  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  @IsOptional()
  @IsString()
  @Column({ type: 'text' })
  public title: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  @Column({ type: 'text', nullable: true })
  public thumbnailUrl: string | null;

  @IsOptional()
  @IsString()
  @Column({ type: 'text', nullable: true })
  public content: string | null;

  @IsOptional()
  @IsUUID('4')
  @Column({ type: 'uuid' })
  public userId: string;

  @OneToMany(() => CollectionResource, (collectionResource) => collectionResource.collection)
  public collectionResources?: CollectionResource[];

  @BeforeInsert()
  @BeforeUpdate()
  protected validate(): void {
    Validator.validate(this);
  }
}
