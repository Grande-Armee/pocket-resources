import { UserResourceStatus, Validator } from '@grande-armee/pocket-common';
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
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

import { Resource } from '@domain/resource/entities/resource';
import { UserResourceTag } from '@domain/userResourceTag/entities/userResourceTag';

export const USER_RESOURCE_TABLE_NAME = 'userResources';

@Unique('UQ_resourceId_userId', ['resourceId', 'userId'])
@Entity({
  name: USER_RESOURCE_TABLE_NAME,
})
export class UserResource {
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
  @IsEnum(UserResourceStatus)
  @Column({
    type: 'enum',
    enum: UserResourceStatus,
    default: UserResourceStatus.toRead,
  })
  public status: UserResourceStatus;

  @IsOptional()
  @IsBoolean()
  @Column({
    type: 'boolean',
    default: false,
  })
  public isFavorite: boolean;

  @IsOptional()
  @IsInt()
  @Column({
    type: 'int',
    nullable: true,
  })
  public rating: number | null;

  @ManyToOne(() => Resource, (resource) => resource.userResources)
  public resource?: Resource;

  @IsOptional()
  @IsUUID('4')
  @Column({ type: 'uuid' })
  public resourceId: string;

  @OneToMany(() => UserResourceTag, (userResourceTag) => userResourceTag.userResource)
  public userResourceTags?: UserResourceTag[];

  @IsOptional()
  @IsUUID('4')
  @Column({ type: 'uuid' })
  public userId: string;

  @BeforeInsert()
  @BeforeUpdate()
  protected validate(): void {
    Validator.validate(this);
  }
}
