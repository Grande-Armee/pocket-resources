import { Injectable } from '@nestjs/common';

import { PostgresUnitOfWork } from '@shared/unitOfWork/providers/unitOfWorkFactory';

import { TagCreatedEvent, TagRemovedEvent, TagUpdatedEvent } from '../../domainEvents';
import { TagDto } from '../../dtos/tagDto';
import { TagRepositoryFactory } from '../../repositories/tag/tagRepository';
import { CreateTagData, UpdateTagData } from './interfaces';

@Injectable()
export class TagService {
  public constructor(private readonly tagRepositoryFactory: TagRepositoryFactory) {}

  public async createTag(unitOfWork: PostgresUnitOfWork, tagData: CreateTagData): Promise<TagDto> {
    const entityManager = unitOfWork.getEntityManager();
    const domainEventsDispatcher = unitOfWork.getDomainEventsDispatcher();
    const tagRepository = this.tagRepositoryFactory.create(entityManager);

    const tag = await tagRepository.createOne(tagData);

    domainEventsDispatcher.addEvent(
      new TagCreatedEvent({
        id: tag.id,
      }),
    );

    return tag;
  }

  public async findTag(unitOfWork: PostgresUnitOfWork, tagId: string): Promise<TagDto> {
    const entityManager = unitOfWork.getEntityManager();
    const tagRepository = this.tagRepositoryFactory.create(entityManager);

    const tag = await tagRepository.findOne({ id: tagId });

    if (!tag) {
      throw new Error('Tag not found.');
    }

    return tag;
  }

  public async updateTag(unitOfWork: PostgresUnitOfWork, tagId: string, tagData: UpdateTagData): Promise<TagDto> {
    const entityManager = unitOfWork.getEntityManager();
    const domainEventsDispatcher = unitOfWork.getDomainEventsDispatcher();
    const tagRepository = this.tagRepositoryFactory.create(entityManager);

    const tag = await tagRepository.updateOne(tagId, { ...tagData });

    domainEventsDispatcher.addEvent(
      new TagUpdatedEvent({
        id: tag.id,
      }),
    );

    return tag;
  }

  public async removeTag(unitOfWork: PostgresUnitOfWork, tagId: string): Promise<void> {
    const entityManager = unitOfWork.getEntityManager();
    const domainEventsDispatcher = unitOfWork.getDomainEventsDispatcher();
    const tagRepository = this.tagRepositoryFactory.create(entityManager);

    await tagRepository.removeOne(tagId);

    domainEventsDispatcher.addEvent(
      new TagRemovedEvent({
        id: tagId,
      }),
    );
  }
}
