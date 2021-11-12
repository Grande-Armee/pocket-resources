import { Expose } from 'class-transformer';
import { IsUUID, IsOptional, IsDate, IsString, IsUrl } from 'class-validator';
import { Entity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, Column, ManyToOne } from 'typeorm';

import { UserResource } from '../../user-resource/entities/user-resource.entity';

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
  @Column({ type: 'text' })
  public title: string;

  @IsString()
  @Expose()
  @Column({ type: 'text' })
  public url: string;

  @IsString()
  @IsUrl()
  @Expose()
  @Column({ type: 'text' })
  public thumbnailUrl: string;

  @IsString()
  @Expose()
  @Column({ type: 'text' })
  public content: string;

  @Expose()
  @ManyToOne(() => UserResource, (userResource) => userResource.resource)
  public userResources: UserResource[];
}

// TODO: validation
