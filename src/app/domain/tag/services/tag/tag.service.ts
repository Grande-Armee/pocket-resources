import { Injectable } from '@nestjs/common';

import { UnitOfWork } from '../../../../shared/unit-of-work/providers/unit-of-work-factory';
import { TagCreatedEvent } from '../../domain-events/tag-created.event';
import { TagDTO } from '../../dtos/tag.dto';
import { TagRepositoryFactory } from '../../repositories/tag/tag.repository';

@Injectable()
export class TagService {
  public constructor(private readonly tagRepositoryFactory: TagRepositoryFactory) {}

  public async findTag(unitOfWork: UnitOfWork, tagId: string): Promise<TagDTO> {
    const entityManager = unitOfWork.getEntityManager();
    const tagRepository = this.tagRepositoryFactory.create(entityManager);

    const tag = await tagRepository.findOneById(tagId);

    if (!tag) {
      throw new Error('Tag not found.');
    }

    return tag;
  }

  public async createTag(unitOfWork: UnitOfWork): Promise<TagDTO> {
    const entityManager = unitOfWork.getEntityManager();
    const domainEventsDispatcher = unitOfWork.getDomainEventsDispatcher();
    const tagRepository = this.tagRepositoryFactory.create(entityManager);

    const tag = await tagRepository.createOne();

    domainEventsDispatcher.addEvent(
      new TagCreatedEvent({
        id: tag.id,
      }),
    );

    return tag;
  }
}
