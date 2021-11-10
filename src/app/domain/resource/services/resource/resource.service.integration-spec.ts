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
      expect.assertions(3);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();
        const domainEventsDispatcher = unitOfWork.getDomainEventsDispatcher();

        const resourceRepository = resourceRepositoryFactory.create(entityManager);

        const createdResourceDTO = await resourceService.createResource(unitOfWork);

        expect(createdResourceDTO.id).toBe('ef492cef-c478-4974-8555-97adadcc5c15');

        const resourceDTO = await resourceRepository.findOneById(createdResourceDTO.id);

        expect(resourceDTO).not.toBe(null);

        const domainEvents = domainEventsDispatcher.getEvents();

        expect(domainEvents.at(0) instanceof ResourceCreatedEvent).toBe(true);
      });
    });
  });
});
