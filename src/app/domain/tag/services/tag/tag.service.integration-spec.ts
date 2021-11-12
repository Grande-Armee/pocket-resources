import { TestingModule } from '@nestjs/testing';

import { PostgresHelper } from '../../../../../integration-tests/helpers/postgres/postgres.helper';
import { TestModuleHelper } from '../../../../../integration-tests/helpers/test-module/test-module.helper';
import { TagCreatedEvent } from '../../domain-events/tag-created.event';
import { TagRemovedEvent } from '../../domain-events/tag-removed.event';
import { TagUpdatedEvent } from '../../domain-events/tag-updated.event';
import { TagRepositoryFactory } from '../../repositories/tag/tag.repository';
import { TagTestFactory } from '../../tests-factories/tag.factory';
import { TagService } from './tag.service';

describe('TagService', () => {
  let testingModule: TestingModule;
  let postgresHelper: PostgresHelper;

  let tagService: TagService;
  let tagRepositoryFactory: TagRepositoryFactory;

  beforeEach(async () => {
    testingModule = await TestModuleHelper.createTestingModule();
    postgresHelper = new PostgresHelper(testingModule);

    tagService = testingModule.get(TagService);
    tagRepositoryFactory = testingModule.get(TagRepositoryFactory);
  });

  afterEach(async () => {
    await testingModule.close();
  });

  describe('Create tag', () => {
    it('creates a tag in the database', async () => {
      expect.assertions(6);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();
        const domainEventsDispatcher = unitOfWork.getDomainEventsDispatcher();

        const tagRepository = tagRepositoryFactory.create(entityManager);

        const title = TagTestFactory.createTitle();
        const color = TagTestFactory.createColor();
        const userId = TagTestFactory.createId();

        const createdTagDTO = await tagService.createTag(unitOfWork, { title, color, userId });

        expect(createdTagDTO.title).toBe(title);
        expect(createdTagDTO.color).toBe(color);
        expect(createdTagDTO.userId).toBe(userId);

        const tagDTO = await tagRepository.findOne({ id: createdTagDTO.id });

        expect(tagDTO).not.toBe(null);

        const domainEvents = domainEventsDispatcher.getEvents();

        expect(domainEvents.length).toBe(1);
        expect(domainEvents.at(0) instanceof TagCreatedEvent).toBe(true);
      });
    });
  });

  describe('Find tag', () => {
    it('should return tag if tag with given id exists', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();

        const tagRepository = tagRepositoryFactory.create(entityManager);

        const title = TagTestFactory.createTitle();
        const color = TagTestFactory.createColor();
        const userId = TagTestFactory.createId();

        const tagDTO = await tagRepository.createOne({ title, color, userId });

        const foundTagDTO = await tagService.findTag(unitOfWork, tagDTO.id);

        expect(foundTagDTO).not.toBe(null);
      });
    });

    it('should throw if tag with given id does not exist', async () => {
      expect.assertions(1);

      const nonExistingId = TagTestFactory.createId();

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        try {
          await tagService.findTag(unitOfWork, nonExistingId);
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  describe('Update tag', () => {
    it('updates a tag in the database', async () => {
      expect.assertions(4);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();
        const domainEventsDispatcher = unitOfWork.getDomainEventsDispatcher();

        const tagRepository = tagRepositoryFactory.create(entityManager);

        const title = TagTestFactory.createTitle();
        const titleAfterUpdate = TagTestFactory.createTitle();
        const color = TagTestFactory.createColor();
        const userId = TagTestFactory.createId();

        const tagDTOBeforeUpdate = await tagRepository.createOne({ title, color, userId });

        const tagDTOAfterUpdate = await tagService.updateTag(unitOfWork, tagDTOBeforeUpdate.id, {
          title: titleAfterUpdate,
        });

        expect(tagDTOAfterUpdate.title).toBe(titleAfterUpdate);

        const tagInDb = await tagRepository.findOne({ id: tagDTOBeforeUpdate.id });

        expect(tagInDb).not.toBe(null);

        const domainEvents = domainEventsDispatcher.getEvents();

        expect(domainEvents.length).toBe(1);
        expect(domainEvents.at(0) instanceof TagUpdatedEvent).toBe(true);
      });
    });

    it('should throw if tag with given id does not exist', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const title = TagTestFactory.createTitle();
        const nonExistingId = TagTestFactory.createId();

        try {
          await tagService.updateTag(unitOfWork, nonExistingId, { title });
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  describe('Remove tag', () => {
    it('removes tag from database', async () => {
      expect.assertions(3);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();
        const domainEventsDispatcher = unitOfWork.getDomainEventsDispatcher();

        const tagRepository = tagRepositoryFactory.create(entityManager);

        const title = TagTestFactory.createTitle();
        const color = TagTestFactory.createColor();
        const userId = TagTestFactory.createId();

        const tagDTO = await tagRepository.createOne({ title, color, userId });

        await tagService.removeTag(unitOfWork, tagDTO.id);

        const tagInDb = await tagRepository.findOne({ id: tagDTO.id });

        expect(tagInDb).toBe(null);

        const domainEvents = domainEventsDispatcher.getEvents();

        expect(domainEvents.length).toBe(1);
        expect(domainEvents.at(0) instanceof TagRemovedEvent).toBe(true);
      });
    });

    it('should throw if tag with given id does not exist', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const nonExistingId = TagTestFactory.createId();

        try {
          await tagService.removeTag(unitOfWork, nonExistingId);
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });
  });
});
