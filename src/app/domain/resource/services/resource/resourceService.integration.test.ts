import { TestingModule } from '@nestjs/testing';

import { PostgresHelper } from '@integration/helpers/postgresHelper/postgresHelper';
import { TestModuleHelper } from '@integration/helpers/testModuleHelper/testModuleHelper';

import { ResourceCreatedEvent, ResourceRemovedEvent, ResourceUpdatedEvent } from '../../integrationEvents';
import { ResourceRepositoryFactory } from '../../repositories/resource/resourceRepository';
import { ResourceTestDataGenerator } from '../../testDataGenerators/resourceTestDataGenerator';
import { ResourceService } from './resourceService';

describe('ResourceService', () => {
  let testingModule: TestingModule;
  let postgresHelper: PostgresHelper;
  let resourceTestDataGenerator: ResourceTestDataGenerator;

  let resourceService: ResourceService;
  let resourceRepositoryFactory: ResourceRepositoryFactory;

  beforeEach(async () => {
    testingModule = await TestModuleHelper.createTestingModule();
    postgresHelper = new PostgresHelper(testingModule);
    resourceTestDataGenerator = new ResourceTestDataGenerator();

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
        const { entityManager, integrationEventsDispatcher } = unitOfWork;

        const resourceRepository = resourceRepositoryFactory.create(entityManager);

        const { url } = resourceTestDataGenerator.generateEntityData();

        const createdResourceDto = await resourceService.createResource(unitOfWork, { url });

        expect(createdResourceDto.url).toBe(url);

        const resourceDto = await resourceRepository.findOneById(createdResourceDto.id);

        expect(resourceDto).not.toBeNull();

        const integrationEvents = integrationEventsDispatcher.getEvents();

        expect(integrationEvents).toHaveLength(1);
        expect(integrationEvents.at(0) instanceof ResourceCreatedEvent).toBe(true);
      });
    });

    it('should not create resource if resource with the same url already exists', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { entityManager } = unitOfWork;

        const resourceRepository = resourceRepositoryFactory.create(entityManager);

        const { url } = resourceTestDataGenerator.generateEntityData();

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
        const { entityManager } = unitOfWork;

        const resourceRepository = resourceRepositoryFactory.create(entityManager);

        const { url } = resourceTestDataGenerator.generateEntityData();

        const resourceDto = await resourceRepository.createOne({ url });

        const foundResourceDto = await resourceService.findResource(unitOfWork, resourceDto.id);

        expect(foundResourceDto).not.toBeNull();
      });
    });

    it('should throw if resource with given id does not exist', async () => {
      expect.assertions(1);

      const { id: nonExistingId } = resourceTestDataGenerator.generateEntityData();

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
        const { entityManager, integrationEventsDispatcher } = unitOfWork;

        const resourceRepository = resourceRepositoryFactory.create(entityManager);

        const { title, url } = resourceTestDataGenerator.generateEntityData();

        const resourceDtoBeforeUpdate = await resourceRepository.createOne({ url });

        const resourceDtoAfterUpdate = await resourceService.updateResource(unitOfWork, resourceDtoBeforeUpdate.id, {
          title,
        });

        expect(resourceDtoAfterUpdate.title).toBe(title);
        expect(resourceDtoAfterUpdate.url).toBe(url);

        const resourceInDb = await resourceRepository.findOneById(resourceDtoBeforeUpdate.id);

        expect(resourceInDb).not.toBeNull();

        const integrationEvents = integrationEventsDispatcher.getEvents();

        expect(integrationEvents).toHaveLength(1);
        expect(integrationEvents.at(0) instanceof ResourceUpdatedEvent).toBe(true);
      });
    });

    it('should throw if resource with given id does not exist', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { title, id: nonExistingId } = resourceTestDataGenerator.generateEntityData();

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
        const { entityManager, integrationEventsDispatcher } = unitOfWork;

        const resourceRepository = resourceRepositoryFactory.create(entityManager);

        const { url } = resourceTestDataGenerator.generateEntityData();

        const resourceDto = await resourceRepository.createOne({ url });

        await resourceService.removeResource(unitOfWork, resourceDto.id);

        const resourceInDb = await resourceRepository.findOneById(resourceDto.id);

        expect(resourceInDb).toBeNull();

        const integrationEvents = integrationEventsDispatcher.getEvents();

        expect(integrationEvents).toHaveLength(1);
        expect(integrationEvents.at(0) instanceof ResourceRemovedEvent).toBe(true);
      });
    });

    it('should throw if resource with given id does not exist', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { id: nonExistingId } = resourceTestDataGenerator.generateEntityData();

        try {
          await resourceService.removeResource(unitOfWork, nonExistingId);
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });
  });
});
