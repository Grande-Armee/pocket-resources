import { Transformer } from '@grande-armee/pocket-common';
import { IsDate, IsString, IsUUID } from 'class-validator';

export class TagDto {
  @IsUUID('4')
  public readonly id: string;

  @IsDate()
  public readonly createdAt: Date;

  @IsDate()
  public readonly updatedAt: Date;

  @IsString()
  public readonly color: string;

  @IsString()
  public readonly title: string;

  @IsString()
  public readonly userId: string;

  public static readonly create = Transformer.createInstanceFactory(TagDto);
}
