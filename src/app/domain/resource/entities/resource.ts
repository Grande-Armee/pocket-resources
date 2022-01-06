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
import { UserResource } from '@domain/userResource/entities/userResource';

export const RESOURCE_TABLE_NAME = 'resources';

@Entity({
  name: RESOURCE_TABLE_NAME,
})
export class Resource {
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
  @Column({ type: 'text', unique: true })
  public url: string;

  @IsOptional()
  @IsString()
  @Column({ type: 'text', nullable: true })
  public title: string | null;

  @IsOptional()
  @IsString()
  @IsUrl()
  @Column({ type: 'text', nullable: true })
  public thumbnailUrl: string | null;

  @IsOptional()
  @IsString()
  @Column({ type: 'text', nullable: true })
  public content: string | null;

  @OneToMany(() => UserResource, (userResource) => userResource.resource)
  public userResources?: UserResource[];

  @OneToMany(() => CollectionResource, (collectionResource) => collectionResource.resource)
  public collectionResources?: CollectionResource[];

  @BeforeInsert()
  @BeforeUpdate()
  protected validate(): void {
    Validator.validate(this);
  }
}
