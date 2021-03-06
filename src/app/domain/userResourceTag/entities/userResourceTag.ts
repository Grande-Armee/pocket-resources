import { Validator } from '@grande-armee/pocket-common';
import { IsUUID, IsOptional, IsDate } from 'class-validator';
import {
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  Unique,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

import { Tag } from '@domain/tag/entities/tag';
import { UserResource } from '@domain/userResource/entities/userResource';

export const USER_RESOURCE_TAG_TABLE_NAME = 'userResourcesTags';

@Unique('UQ_userResourceId_tagId', ['userResourceId', 'tagId'])
@Entity({
  name: USER_RESOURCE_TAG_TABLE_NAME,
})
export class UserResourceTag {
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

  @ManyToOne(() => UserResource, (userResource) => userResource.userResourceTags)
  public userResource?: UserResource;

  @IsOptional()
  @IsUUID('4')
  @Column({ type: 'uuid' })
  public userResourceId: string;

  @ManyToOne(() => Tag, (tag) => tag.id)
  public tag?: Tag;

  @IsOptional()
  @IsUUID('4')
  @Column({ type: 'uuid' })
  public tagId: string;

  @BeforeInsert()
  @BeforeUpdate()
  protected validate(): void {
    Validator.validate(this);
  }
}
