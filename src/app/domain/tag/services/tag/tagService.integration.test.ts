import { Test, TestingModule } from '@nestjs/testing';

import { DomainModule } from '@domain/domainModule';
import { TagNotFoundError } from '@domain/tag/errors';
import { PostgresHelper } from '@integration/helpers/postgresHelper/postgresHelper';
import { DatabaseModule } from '@shared/database/databaseModule';
import { UnitOfWorkModule } from '@shared/unitOfWork/unitOfWorkModule';

import { TagCreatedEvent, TagRemovedEvent, TagUpdatedEvent } from '../../integrationEvents';
import { TagRepositoryFactory } from '../../repositories/tag/tagRepository';
import { TagTestDataGenerator } from '../../testDataGenerators/tagTestDataGenerator';
import { TagService } from './tagService';

describe('TagService', () => {
  let testingModule: TestingModule;
  let postgresHelper: PostgresHelper;
  let tagTestDataGenerator: TagTestDataGenerator;

  let tagService: TagService;
  let tagRepositoryFactory: TagRepositoryFactory;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [DatabaseModule, UnitOfWorkModule, DomainModule],
    }).compile();

    postgresHelper = new PostgresHelper(testingModule);
    tagTestDataGenerator = new TagTestDataGenerator();

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
        const { entityManager, integrationEventsStore } = unitOfWork;

        const tagRepository = tagRepositoryFactory.create(entityManager);

        const { title, userId, color } = tagTestDataGenerator.generateEntityData();

        const createdTagDto = await tagService.createTag(unitOfWork, { title, color, userId });

        expect(createdTagDto.title).toBe(title);
        expect(createdTagDto.color).toBe(color);
        expect(createdTagDto.userId).toBe(userId);

        const tagDto = await tagRepository.findOne({ id: createdTagDto.id });

        expect(tagDto).not.toBeNull();

        const integrationEvents = integrationEventsStore.getEvents();

        expect(integrationEvents).toHaveLength(1);
        expect(integrationEvents.at(0) instanceof TagCreatedEvent).toBe(true);
      });
    });
  });

  describe('Find tag', () => {
    it('should return tag if tag with given id exists', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { entityManager } = unitOfWork;

        const tagRepository = tagRepositoryFactory.create(entityManager);

        const { title, userId, color } = tagTestDataGenerator.generateEntityData();

        const tagDto = await tagRepository.createOne({ title, color, userId });

        const foundTagDto = await tagService.findTag(unitOfWork, tagDto.id);

        expect(foundTagDto).not.toBeNull();
      });
    });

    it('should throw if tag with given id does not exist', async () => {
      expect.assertions(1);

      const { id: nonExistingId } = tagTestDataGenerator.generateEntityData();

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        try {
          await tagService.findTag(unitOfWork, nonExistingId);
        } catch (error) {
          expect(error instanceof TagNotFoundError).toBe(true);
        }
      });
    });
  });

  describe('Update tag', () => {
    it('updates a tag in the database', async () => {
      expect.assertions(4);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { entityManager, integrationEventsStore } = unitOfWork;

        const tagRepository = tagRepositoryFactory.create(entityManager);

        const { title, userId, color } = tagTestDataGenerator.generateEntityData();
        const { title: titleAfterUpdate } = tagTestDataGenerator.generateEntityData();

        const tagDtoBeforeUpdate = await tagRepository.createOne({ title, color, userId });

        const tagDtoAfterUpdate = await tagService.updateTag(unitOfWork, tagDtoBeforeUpdate.id, {
          title: titleAfterUpdate,
        });

        expect(tagDtoAfterUpdate.title).toBe(titleAfterUpdate);

        const tagInDb = await tagRepository.findOne({ id: tagDtoBeforeUpdate.id });

        expect(tagInDb).not.toBeNull();

        const integrationEvents = integrationEventsStore.getEvents();

        expect(integrationEvents).toHaveLength(1);
        expect(integrationEvents.at(0) instanceof TagUpdatedEvent).toBe(true);
      });
    });

    it('should throw if tag with given id does not exist', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { title, id: nonExistingId } = tagTestDataGenerator.generateEntityData();

        try {
          await tagService.updateTag(unitOfWork, nonExistingId, { title });
        } catch (error) {
          expect(error instanceof TagNotFoundError).toBe(true);
        }
      });
    });
  });

  describe('Remove tag', () => {
    it('removes tag from database', async () => {
      expect.assertions(3);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { entityManager, integrationEventsStore } = unitOfWork;

        const tagRepository = tagRepositoryFactory.create(entityManager);

        const { title, userId, color } = tagTestDataGenerator.generateEntityData();

        const tagDto = await tagRepository.createOne({ title, color, userId });

        await tagService.removeTag(unitOfWork, tagDto.id);

        const tagInDb = await tagRepository.findOne({ id: tagDto.id });

        expect(tagInDb).toBeNull();

        const integrationEvents = integrationEventsStore.getEvents();

        expect(integrationEvents).toHaveLength(1);
        expect(integrationEvents.at(0) instanceof TagRemovedEvent).toBe(true);
      });
    });

    it('should throw if tag with given id does not exist', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { id: nonExistingId } = tagTestDataGenerator.generateEntityData();

        try {
          await tagService.removeTag(unitOfWork, nonExistingId);
        } catch (error) {
          expect(error instanceof TagNotFoundError).toBe(true);
        }
      });
    });
  });
});
