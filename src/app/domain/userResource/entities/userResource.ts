import { Expose } from 'class-transformer';
import { IsUUID, IsOptional, IsDate, IsEnum, IsBoolean, IsInt } from 'class-validator';
import {
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';

import { Resource } from '@domain/resource/entities/resource';
import { UserResourceTag } from '@domain/userResourceTag/entities/userResourceTag';

import { UserResourceStatus } from './types/userResourceStatus';

export const USER_RESOURCE_TABLE_NAME = 'userResources';

@Unique('UQ_resourceId_userId', ['resourceId', 'userId'])
@Entity({
  name: USER_RESOURCE_TABLE_NAME,
})
export class UserResource {
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

  @IsEnum(UserResourceStatus)
  @Expose()
  @Column({
    type: 'enum',
    enum: UserResourceStatus,
    default: UserResourceStatus.toRead,
  })
  public status: UserResourceStatus;

  @IsBoolean()
  @Expose()
  @Column({
    type: 'boolean',
    default: false,
  })
  public isFavorite: boolean;

  @IsInt()
  @Expose()
  @Column({
    type: 'int',
    nullable: true,
  })
  public rating: number | null;

  @Expose()
  @ManyToOne(() => Resource, (resource) => resource.userResources)
  public resource?: Resource;

  @IsUUID('4')
  @Expose()
  @Column({ type: 'uuid' })
  public resourceId: string;

  @Expose()
  @OneToMany(() => UserResourceTag, (userResourceTag) => userResourceTag.userResource)
  public userResourceTags?: UserResourceTag[];

  @IsUUID('4')
  @Expose()
  @Column({ type: 'uuid' })
  public userId: string;
}
