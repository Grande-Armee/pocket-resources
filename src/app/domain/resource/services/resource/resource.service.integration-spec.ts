import { TestingModule } from '@nestjs/testing';

import { PostgresHelper } from '../../../../../integration-tests/helpers/postgres/postgres.helper';
import { TestModuleHelper } from '../../../../../integration-tests/helpers/test-module/test-module.helper';
import { ResourceCreatedEvent } from '../../domain-events/resource-created.event';
import { ResourceRepositoryFactory } from '../../repositories/resource/resource.repository';
import { ResourceService } from './resource.service';

describe('ResourceService', () => {
  let testingModule: TestingModule;
  let postgresHelper: PostgresHelper;

  let resourceService: ResourceService;
  let resourceRepositoryFactory: ResourceRepositoryFactory;

  beforeEach(async () => {
    testingModule = await TestModuleHelper.createTestingModule();
    postgresHelper = new PostgresHelper(testingModule);

    resourceService = testingModule.get(ResourceService);
    resourceRepositoryFactory = testingModule.get(ResourceRepositoryFactory);
  });

  afterEach(async () => {
    await testingModule.close();
  });

  describe('Create resource', () => {
    it('creates a resource in the database', async () => {
      expect.assertions(6);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();
        const domainEventsDispatcher = unitOfWork.getDomainEventsDispatcher();

        const resourceRepository = resourceRepositoryFactory.create(entityManager);

        const title = 'title';
        const content = 'content';
        const url = 'url';
        const thumbnailUrl = 'thumbnailUrl';

        const createdResourceDTO = await resourceService.createResource(unitOfWork, {
          title,
          content,
          url,
          thumbnailUrl,
        });

        expect(createdResourceDTO.title).toBe(title);
        expect(createdResourceDTO.content).toBe(content);
        expect(createdResourceDTO.url).toBe(url);
        expect(createdResourceDTO.thumbnailUrl).toBe(thumbnailUrl);

        const resourceDTO = await resourceRepository.findOneById(createdResourceDTO.id);

        expect(resourceDTO).not.toBe(null);

        const domainEvents = domainEventsDispatcher.getEvents();

        expect(domainEvents.at(0) instanceof ResourceCreatedEvent).toBe(true);
      });
    });

    it('should not create resource if resource with the same url already exists', async () => {
      expect.assertions(2);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();
        const domainEventsDispatcher = unitOfWork.getDomainEventsDispatcher();

        const resourceRepository = resourceRepositoryFactory.create(entityManager);

        const title = 'title';
        const content = 'content';
        const url = 'url';
        const thumbnailUrl = 'thumbnailUrl';

        await resourceRepository.createOne({ title, content, url, thumbnailUrl });

        try {
          await resourceService.createResource(unitOfWork, { title, content, url, thumbnailUrl });
        } catch (error) {
          expect(error).toBeTruthy();
        }

        const domainEvents = domainEventsDispatcher.getEvents();
        expect(domainEvents.length).toBe(0);
      });
    });
  });
});
