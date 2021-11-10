import { TestingModule } from '@nestjs/testing';

import { PostgresHelper } from '../../../../../integration-tests/helpers/postgres/postgres.helper';
import { TestModuleHelper } from '../../../../../integration-tests/helpers/test-module/test-module.helper';
import { TagCreatedEvent } from '../../domain-events/tag-created.event';
import { TagRepositoryFactory } from '../../repositories/tag/tag.repository';
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
      expect.assertions(3);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();
        const domainEventsDispatcher = unitOfWork.getDomainEventsDispatcher();
        const tagRepository = tagRepositoryFactory.create(entityManager);

        const createdTagDTO = await tagService.createTag(unitOfWork);

        expect(createdTagDTO.id).toBe('ef492cef-c478-4974-8555-97adadcc5c15');

        const tagDTO = await tagRepository.findOneById(createdTagDTO.id);

        expect(tagDTO).not.toBe(null);

        const domainEvents = domainEventsDispatcher.getEvents();

        expect(domainEvents.at(0) instanceof TagCreatedEvent).toBe(true);
      });
    });
  });
});
