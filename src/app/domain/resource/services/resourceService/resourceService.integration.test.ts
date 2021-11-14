import { TestingModule } from '@nestjs/testing';

import { PostgresHelper } from '../../../../../integration/helpers/postgresHelper/postgresHelper';
import { TestModuleHelper } from '../../../../../integration/helpers/testModuleHelper/testModuleHelper';
import { ResourceCreatedEvent, ResourceRemovedEvent, ResourceUpdatedEvent } from '../../domainEvents';
import { ResourceRepositoryFactory } from '../../repositories/resourceRepository/resourceRepository';
import { ResourceTestFactory } from '../../testFactories/resourceTestFactory';
import { ResourceService } from './resourceService';

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
      expect.assertions(4);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();
        const domainEventsDispatcher = unitOfWork.getDomainEventsDispatcher();

        const resourceRepository = resourceRepositoryFactory.create(entityManager);

        const url = ResourceTestFactory.createUrl();

        const createdResourceDTO = await resourceService.createResource(unitOfWork, { url });

        expect(createdResourceDTO.url).toBe(url);

        const resourceDTO = await resourceRepository.findOneById(createdResourceDTO.id);

        expect(resourceDTO).not.toBe(null);

        const domainEvents = domainEventsDispatcher.getEvents();

        expect(domainEvents.length).toBe(1);
        expect(domainEvents.at(0) instanceof ResourceCreatedEvent).toBe(true);
      });
    });

    it('should not create resource if resource with the same url already exists', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();

        const resourceRepository = resourceRepositoryFactory.create(entityManager);

        const url = ResourceTestFactory.createUrl();

        await resourceRepository.createOne({ url });

        try {
          await resourceService.createResource(unitOfWork, { url });
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  describe('Find resource', () => {
    it('should return resource if resource with given id exists', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();

        const resourceRepository = resourceRepositoryFactory.create(entityManager);

        const url = ResourceTestFactory.createUrl();

        const resourceDTO = await resourceRepository.createOne({ url });

        const foundResourceDTO = await resourceService.findResource(unitOfWork, resourceDTO.id);

        expect(foundResourceDTO).not.toBe(null);
      });
    });

    it('should throw if resource with given id does not exist', async () => {
      expect.assertions(1);

      const nonExistingId = ResourceTestFactory.createId();

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        try {
          await resourceService.findResource(unitOfWork, nonExistingId);
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  describe('Update resource', () => {
    it('updates a resource in the database', async () => {
      expect.assertions(5);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();
        const domainEventsDispatcher = unitOfWork.getDomainEventsDispatcher();

        const resourceRepository = resourceRepositoryFactory.create(entityManager);

        const title = ResourceTestFactory.createTitle();
        const url = ResourceTestFactory.createUrl();

        const resourceDTOBeforeUpdate = await resourceRepository.createOne({ url });

        const resourceDTOAfterUpdate = await resourceService.updateResource(unitOfWork, resourceDTOBeforeUpdate.id, {
          title,
        });

        expect(resourceDTOAfterUpdate.title).toBe(title);
        expect(resourceDTOAfterUpdate.url).toBe(url);

        const resourceInDb = await resourceRepository.findOneById(resourceDTOBeforeUpdate.id);

        expect(resourceInDb).not.toBe(null);

        const domainEvents = domainEventsDispatcher.getEvents();

        expect(domainEvents.length).toBe(1);
        expect(domainEvents.at(0) instanceof ResourceUpdatedEvent).toBe(true);
      });
    });

    it('should throw if resource with given id does not exist', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const title = ResourceTestFactory.createTitle();
        const nonExistingId = ResourceTestFactory.createId();

        try {
          await resourceService.updateResource(unitOfWork, nonExistingId, { title });
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  describe('Remove resource', () => {
    it('removes resource from database', async () => {
      expect.assertions(3);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();
        const domainEventsDispatcher = unitOfWork.getDomainEventsDispatcher();

        const resourceRepository = resourceRepositoryFactory.create(entityManager);

        const url = ResourceTestFactory.createUrl();

        const resourceDTO = await resourceRepository.createOne({ url });

        await resourceService.removeResource(unitOfWork, resourceDTO.id);

        const resourceInDb = await resourceRepository.findOneById(resourceDTO.id);

        expect(resourceInDb).toBe(null);

        const domainEvents = domainEventsDispatcher.getEvents();

        expect(domainEvents.length).toBe(1);
        expect(domainEvents.at(0) instanceof ResourceRemovedEvent).toBe(true);
      });
    });

    it('should throw if resource with given id does not exist', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const nonExistingId = ResourceTestFactory.createId();

        try {
          await resourceService.removeResource(unitOfWork, nonExistingId);
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });
  });
});
