import { IsUUID, IsOptional, IsDate, IsString, IsUrl } from 'class-validator';
import { Entity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, Column, OneToMany } from 'typeorm';

import { CollectionResource } from '@domain/collectionResource/entities/collectionResource';
import { UserResource } from '@domain/userResource/entities/userResource';

export const RESOURCE_TABLE_NAME = 'resources';

@Entity({
  name: RESOURCE_TABLE_NAME,
})
export class Resource {
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
  @Column({ type: 'text', unique: true })
  public url: string;

  @IsString()
  @Column({ type: 'text', nullable: true })
  public title: string | null;

  @IsString()
  @IsUrl()
  @Column({ type: 'text', nullable: true })
  public thumbnailUrl: string | null;

  @IsString()
  @Column({ type: 'text', nullable: true })
  public content: string | null;

  @OneToMany(() => UserResource, (userResource) => userResource.resource)
  public userResources?: UserResource[];

  @OneToMany(() => CollectionResource, (collectionResource) => collectionResource.resource)
  public collectionResources?: CollectionResource[];
}
