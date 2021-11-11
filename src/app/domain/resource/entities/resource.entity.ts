import { Expose } from 'class-transformer';
import { IsUUID, IsOptional, IsDate, IsString, IsUrl } from 'class-validator';
import { Entity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, Column, Unique } from 'typeorm';

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
  @Column({ type: 'text', unique: true })
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
}

// TODO: validation
