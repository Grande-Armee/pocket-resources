import { Expose } from 'class-transformer';
import { IsUUID, IsOptional, IsDate, IsString, IsUrl } from 'class-validator';
import { Entity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, Column, OneToMany } from 'typeorm';

import { UserResource } from '@domain/userResource/entities/userResource';

export const RESOURCE_TABLE_NAME = 'resources';

@Entity({
  name: RESOURCE_TABLE_NAME,
})
export class Resource {
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
  @Column({ type: 'text', unique: true })
  public url: string;

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

  @Expose()
  @OneToMany(() => UserResource, (userResource) => userResource.resource)
  public userResources?: UserResource[];
}
