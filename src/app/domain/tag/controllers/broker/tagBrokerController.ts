import { DtoFactory } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';

import { UnitOfWorkFactory } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { TagService } from '../../services/tag/tagService';
import { CreateTagPayloadDto, CreateTagResponseDto } from './dtos/createTagDto';
import { FindTagPayloadDto, FindTagResponseDto } from './dtos/findTagDto';
import { RemoveTagPayloadDto } from './dtos/removeTagDto';
import { UpdateTagPayloadDto, UpdateTagResponseDto } from './dtos/updateTagDto';

@Injectable()
export class TagBrokerController {
  public constructor(
    private readonly unitOfWorkFactory: UnitOfWorkFactory,
    private readonly dtoFactory: DtoFactory,
    private readonly tagService: TagService,
  ) {}

  public async createTag(payload: CreateTagPayloadDto): Promise<CreateTagResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const tag = await unitOfWork.runInTransaction(async () => {
      const tag = await this.tagService.createTag(unitOfWork, {
        ...payload,
      });

      return tag;
    });

    return this.dtoFactory.createDtoInstance(CreateTagResponseDto, {
      tag: {
        id: tag.id,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
        color: tag.color,
        title: tag.title,
        userId: tag.userId,
      },
    });
  }

  public async findTag(payload: FindTagPayloadDto): Promise<FindTagResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const tag = await unitOfWork.runInTransaction(async () => {
      const { tagId } = payload;

      const tag = await this.tagService.findTag(unitOfWork, tagId);

      return tag;
    });

    return this.dtoFactory.createDtoInstance(CreateTagResponseDto, {
      tag: {
        id: tag.id,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
        color: tag.color,
        title: tag.title,
        userId: tag.userId,
      },
    });
  }

  public async updateTag(payload: UpdateTagPayloadDto): Promise<UpdateTagResponseDto> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    const tag = await unitOfWork.runInTransaction(async () => {
      const { tagId, color, title } = payload;

      const tag = await this.tagService.updateTag(unitOfWork, tagId, {
        color,
        title,
      });

      return tag;
    });

    return this.dtoFactory.createDtoInstance(CreateTagResponseDto, {
      tag: {
        id: tag.id,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
        color: tag.color,
        title: tag.title,
        userId: tag.userId,
      },
    });
  }

  public async removeTag(payload: RemoveTagPayloadDto): Promise<void> {
    const unitOfWork = await this.unitOfWorkFactory.create();

    await unitOfWork.runInTransaction(async () => {
      const { tagId } = payload;

      const tag = await this.tagService.removeTag(unitOfWork, tagId);

      return tag;
    });
  }
}
