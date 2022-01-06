import { Validator } from '@grande-armee/pocket-common';
import { IsUUID, IsOptional, IsDate, IsString } from 'class-validator';
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

import { UserResourceTag } from '@domain/userResourceTag/entities/userResourceTag';

export const TAG_TABLE_NAME = 'tags';

@Entity({
  name: TAG_TABLE_NAME,
})
export class Tag {
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
  @Column({ type: 'varchar', length: 7 })
  public color: string;

  @IsOptional()
  @IsString()
  @Column({ type: 'text' })
  public title: string;

  @OneToMany(() => UserResourceTag, (userResourceTag) => userResourceTag.tag)
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
