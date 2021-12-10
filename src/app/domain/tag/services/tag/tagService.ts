import { LoggerService } from '@grande-armee/pocket-common';
import { Injectable } from '@nestjs/common';

import { PostgresUnitOfWork } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { TagDto } from '../../dtos/tagDto';
import { TagCreatedEvent, TagRemovedEvent, TagUpdatedEvent } from '../../integrationEvents';
import { TagRepositoryFactory } from '../../repositories/tag/tagRepository';
import { CreateTagData, UpdateTagData } from './types';

@Injectable()
export class TagService {
  public constructor(
    private readonly tagRepositoryFactory: TagRepositoryFactory,
    private readonly logger: LoggerService,
  ) {}

  public async createTag(unitOfWork: PostgresUnitOfWork, tagData: CreateTagData): Promise<TagDto> {
    this.logger.debug('Creating tag...');

    const { entityManager, integrationEventsStore } = unitOfWork;
    const tagRepository = this.tagRepositoryFactory.create(entityManager);

    const tag = await tagRepository.createOne(tagData);

    integrationEventsStore.addEvent(
      new TagCreatedEvent(
        {
          id: tag.id,
        },
        'id',
        new Date(),
      ),
    );

    this.logger.info('Tag created.', { tagId: tag.id });

    return tag;
  }

  public async findTag(unitOfWork: PostgresUnitOfWork, tagId: string): Promise<TagDto> {
    const { entityManager } = unitOfWork;
    const tagRepository = this.tagRepositoryFactory.create(entityManager);

    const tag = await tagRepository.findOne({ id: tagId });

    if (!tag) {
      throw new Error('Tag not found.');
    }

    return tag;
  }

  public async updateTag(unitOfWork: PostgresUnitOfWork, tagId: string, tagData: UpdateTagData): Promise<TagDto> {
    this.logger.debug('Updating tag...', { tagId: tagId });

    const { entityManager, integrationEventsStore } = unitOfWork;
    const tagRepository = this.tagRepositoryFactory.create(entityManager);

    const tag = await tagRepository.updateOne(tagId, { ...tagData });

    integrationEventsStore.addEvent(
      new TagUpdatedEvent(
        {
          id: tag.id,
        },
        'id',
        new Date(),
      ),
    );

    this.logger.info('Tag updated.', { tagId: tagId });

    return tag;
  }

  public async removeTag(unitOfWork: PostgresUnitOfWork, tagId: string): Promise<void> {
    this.logger.debug('Removing tag...', { tagId: tagId });

    const { entityManager, integrationEventsStore } = unitOfWork;
    const tagRepository = this.tagRepositoryFactory.create(entityManager);

    await tagRepository.removeOne(tagId);

    integrationEventsStore.addEvent(
      new TagRemovedEvent(
        {
          id: tagId,
        },
        'id',
        new Date(),
      ),
    );

    this.logger.info('Tag removed.', { tagId: tagId });
  }
}
