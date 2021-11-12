import { Injectable } from '@nestjs/common';

import { UnitOfWork } from '../../../../shared/unit-of-work/providers/unit-of-work-factory';
import { TagCreatedEvent } from '../../domain-events/tag-created.event';
import { TagRemovedEvent } from '../../domain-events/tag-removed.event';
import { TagUpdatedEvent } from '../../domain-events/tag-updated.event';
import { TagDTO } from '../../dtos/tag.dto';
import { TagRepositoryFactory } from '../../repositories/tag/tag.repository';
import { CreateTagData } from './interfaces/create-tag-data.interface';
import { UpdateTagData } from './interfaces/update-tag-data.interface';

@Injectable()
export class TagService {
  public constructor(private readonly tagRepositoryFactory: TagRepositoryFactory) {}

  public async createTag(unitOfWork: UnitOfWork, tagData: CreateTagData): Promise<TagDTO> {
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

  public async findTag(unitOfWork: UnitOfWork, tagId: string): Promise<TagDTO> {
    const entityManager = unitOfWork.getEntityManager();
    const tagRepository = this.tagRepositoryFactory.create(entityManager);

    const tag = await tagRepository.findOne({ id: tagId });

    if (!tag) {
      throw new Error('Tag not found.');
    }

    return tag;
  }

  public async updateTag(unitOfWork: UnitOfWork, tagId: string, tagData: UpdateTagData): Promise<TagDTO> {
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

  public async removeTag(unitOfWork: UnitOfWork, tagId: string): Promise<void> {
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
