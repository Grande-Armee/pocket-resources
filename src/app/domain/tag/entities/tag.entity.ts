import { Expose } from 'class-transformer';
import { IsUUID, IsOptional, IsDate, IsString } from 'class-validator';
import { Entity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, Column } from 'typeorm';

export const TAG_TABLE_NAME = 'tags';

@Entity({
  name: TAG_TABLE_NAME,
})
export class Tag {
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
  public color: string;

  @IsString()
  @Expose()
  @Column({ type: 'text' })
  public title: string;

  @IsUUID('4')
  @Expose()
  @Column({ type: 'uuid' })
  public userId: string;
}
