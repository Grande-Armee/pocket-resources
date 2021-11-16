import { Expose } from 'class-transformer';
import { IsUUID, IsOptional, IsDate } from 'class-validator';
import { Entity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, Column, Unique } from 'typeorm';

import { Tag } from '@domain/tag/entities/tag';
import { UserResource } from '@domain/userResource/entities/userResource';

export const USER_RESOURCE_TAG_TABLE_NAME = 'usersResourcesTags';

@Unique('UQ_userResourceId_tagId', ['userResourceId', 'tagId'])
@Entity({
  name: USER_RESOURCE_TAG_TABLE_NAME,
})
export class UserResourceTag {
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

  @Expose()
  @ManyToOne(() => UserResource, (userResource) => userResource.userResourceTags)
  public userResource?: UserResource;

  @IsUUID('4')
  @Expose()
  @Column({ type: 'uuid' })
  public userResourceId: string;

  @Expose()
  @ManyToOne(() => Tag, (tag) => tag.id)
  public tag?: Tag;

  @IsUUID('4')
  @Expose()
  @Column({ type: 'uuid' })
  public tagId: string;
}
