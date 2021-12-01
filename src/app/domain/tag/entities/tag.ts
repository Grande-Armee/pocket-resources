import { IsUUID, IsOptional, IsDate, IsString } from 'class-validator';
import { Entity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, Column, OneToMany } from 'typeorm';

import { UserResourceTag } from '@domain/userResourceTag/entities/userResourceTag';

export const TAG_TABLE_NAME = 'tags';

@Entity({
  name: TAG_TABLE_NAME,
})
export class Tag {
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
  @Column({ type: 'varchar', length: 7 })
  public color: string;

  @IsString()
  @Column({ type: 'text' })
  public title: string;

  @OneToMany(() => UserResourceTag, (userResourceTag) => userResourceTag.tag)
  public userResourceTags?: UserResourceTag[];

  @IsUUID('4')
  @Column({ type: 'uuid' })
  public userId: string;
}
