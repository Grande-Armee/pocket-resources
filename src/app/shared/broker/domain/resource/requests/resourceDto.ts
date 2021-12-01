import { IsDate, IsOptional, IsString } from 'class-validator';

export class ResourceDto {
  @IsString()
  public readonly id: string;

  @IsDate()
  public readonly createdAt: Date;

  @IsDate()
  public readonly updatedAt: Date;

  @IsString()
  public readonly url: string;

  @IsString()
  @IsOptional()
  public readonly title: string | null;

  @IsString()
  @IsOptional()
  public readonly thumbnailUrl: string | null;

  @IsString()
  @IsOptional()
  public readonly content: string | null;
}
