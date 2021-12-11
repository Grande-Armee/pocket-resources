import { Test, TestingModule } from '@nestjs/testing';

import { DomainModule } from '@domain/domainModule';
import { ResourceAlreadyExistsError, ResourceNotFoundError } from '@domain/resource/errors';
import { PostgresHelper } from '@integration/helpers/postgresHelper/postgresHelper';
import { DatabaseModule } from '@shared/database/databaseModule';
import { UnitOfWorkModule } from '@shared/unitOfWork/unitOfWorkModule';

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
    testingModule = await Test.createTestingModule({
      imports: [DatabaseModule, UnitOfWorkModule, DomainModule],
    }).compile();

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
        const { entityManager, integrationEventsStore } = unitOfWork;

        const resourceRepository = resourceRepositoryFactory.create(entityManager);

        const { url } = resourceTestDataGenerator.generateEntityData();

        const createdResourceDto = await resourceService.createResource(unitOfWork, { url });

        expect(createdResourceDto.url).toBe(url);

        const resourceDto = await resourceRepository.findOneById(createdResourceDto.id);

        expect(resourceDto).not.toBeNull();

        const integrationEvents = integrationEventsStore.getEvents();

        expect(integrationEvents).toHaveLength(1);
        expect(integrationEvents.at(0)).toBeInstanceOf(ResourceCreatedEvent);
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
          expect(error).toBeInstanceOf(ResourceAlreadyExistsError);
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
          expect(error).toBeInstanceOf(ResourceNotFoundError);
        }
      });
    });
  });

  describe('Update resource', () => {
    it('updates a resource in the database', async () => {
      expect.assertions(5);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { entityManager, integrationEventsStore } = unitOfWork;

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

        const integrationEvents = integrationEventsStore.getEvents();

        expect(integrationEvents).toHaveLength(1);
        expect(integrationEvents.at(0)).toBeInstanceOf(ResourceUpdatedEvent);
      });
    });

    it('should throw if resource with given id does not exist', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { title, id: nonExistingId } = resourceTestDataGenerator.generateEntityData();

        try {
          await resourceService.updateResource(unitOfWork, nonExistingId, { title });
        } catch (error) {
          expect(error).toBeInstanceOf(ResourceNotFoundError);
        }
      });
    });
  });

  describe('Remove resource', () => {
    it('removes resource from database', async () => {
      expect.assertions(3);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { entityManager, integrationEventsStore } = unitOfWork;

        const resourceRepository = resourceRepositoryFactory.create(entityManager);

        const { url } = resourceTestDataGenerator.generateEntityData();

        const resourceDto = await resourceRepository.createOne({ url });

        await resourceService.removeResource(unitOfWork, resourceDto.id);

        const resourceInDb = await resourceRepository.findOneById(resourceDto.id);

        expect(resourceInDb).toBeNull();

        const integrationEvents = integrationEventsStore.getEvents();

        expect(integrationEvents).toHaveLength(1);
        expect(integrationEvents.at(0)).toBeInstanceOf(ResourceRemovedEvent);
      });
    });

    it('should throw if resource with given id does not exist', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { id: nonExistingId } = resourceTestDataGenerator.generateEntityData();

        try {
          await resourceService.removeResource(unitOfWork, nonExistingId);
        } catch (error) {
          expect(error).toBeInstanceOf(ResourceNotFoundError);
        }
      });
    });
  });
});
