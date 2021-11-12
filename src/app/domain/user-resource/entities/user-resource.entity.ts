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

import { Resource } from '../../resource/entities/resource.entity';
import { UserResourceTag } from '../../user-resource-tag/entities/user-resource-tag.entity';

export const USER_RESOURCE_TABLE_NAME = 'userResources';

export enum UserResourceStatus {
  toRead = 'TO_READ',
  inArchive = 'IN_ARCHIVE',
  inTrash = 'IN_TRASH',
}

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
  public resource: Resource;

  @IsUUID('4')
  @Expose()
  @Column({ type: 'uuid' })
  public resourceId: string;

  // TODO: null
  @Expose()
  @OneToMany(() => UserResourceTag, (userResourceTag) => userResourceTag.userResource)
  public userResourceTags: UserResourceTag[];

  @IsUUID('4')
  @Expose()
  @Column({ type: 'uuid' })
  public userId: string;
}

// TODO: userId & resourceId unique
