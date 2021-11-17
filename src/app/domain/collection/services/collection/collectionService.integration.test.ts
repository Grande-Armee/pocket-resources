import { TestingModule } from '@nestjs/testing';

import { CollectionResourceRepositoryFactory } from '@domain/collectionResource/repositories/collectionResource/collectionResourceRepository';
import { ResourceRepositoryFactory } from '@domain/resource/repositories/resource/resourceRepository';
import { ResourceTestDataGenerator } from '@domain/resource/testDataGenerators/resourceTestDataGenerator';
import { PostgresHelper } from '@integration/helpers/postgresHelper/postgresHelper';
import { TestModuleHelper } from '@integration/helpers/testModuleHelper/testModuleHelper';

import { CollectionCreatedEvent, CollectionRemovedEvent, CollectionUpdatedEvent } from '../../domainEvents';
import { CollectionRepositoryFactory } from '../../repositories/collection/collectionRepository';
import { CollectionTestDataGenerator } from '../../testDataGenerators/collectionTestDataGenerator';
import { CollectionService } from './collectionService';

describe('CollectionService', () => {
  let testingModule: TestingModule;
  let postgresHelper: PostgresHelper;
  let collectionTestDataGenerator: CollectionTestDataGenerator;
  let resourceTestDataGenerator: ResourceTestDataGenerator;

  let collectionService: CollectionService;
  let collectionRepositoryFactory: CollectionRepositoryFactory;

  let resourceRepositoryFactory: ResourceRepositoryFactory;

  let collectionResourceRepositoryFactory: CollectionResourceRepositoryFactory;

  beforeEach(async () => {
    testingModule = await TestModuleHelper.createTestingModule();
    postgresHelper = new PostgresHelper(testingModule);
    collectionTestDataGenerator = new CollectionTestDataGenerator();
    resourceTestDataGenerator = new ResourceTestDataGenerator();

    collectionService = testingModule.get(CollectionService);
    collectionRepositoryFactory = testingModule.get(CollectionRepositoryFactory);
    resourceRepositoryFactory = testingModule.get(ResourceRepositoryFactory);
    collectionResourceRepositoryFactory = testingModule.get(CollectionResourceRepositoryFactory);
  });

  afterEach(async () => {
    await testingModule.close();
  });

  describe('Create collection', () => {
    it('creates a collection in the database', async () => {
      expect.assertions(4);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();
        const domainEventsDispatcher = unitOfWork.getDomainEventsDispatcher();

        const collectionRepository = collectionRepositoryFactory.create(entityManager);

        const { userId } = collectionTestDataGenerator.generateEntityData();

        const createdCollectionDto = await collectionService.createCollection(unitOfWork, { userId });

        expect(createdCollectionDto.userId).toBe(userId);

        const collectionDto = await collectionRepository.findOneById(createdCollectionDto.id);

        expect(collectionDto).not.toBeNull();

        const domainEvents = domainEventsDispatcher.getEvents();

        expect(domainEvents).toHaveLength(1);
        expect(domainEvents.at(0) instanceof CollectionCreatedEvent).toBe(true);
      });
    });

    it('should not create collection if collection with the same userId already exists', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();

        const collectionRepository = collectionRepositoryFactory.create(entityManager);

        const { userId } = collectionTestDataGenerator.generateEntityData();

        await collectionRepository.createOne({ userId });

        try {
          await collectionService.createCollection(unitOfWork, { userId });
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  describe('Find collection', () => {
    it('should return collection if collection with given id exists', async () => {
      expect.assertions(3);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();

        const collectionRepository = collectionRepositoryFactory.create(entityManager);
        const resourceRepository = resourceRepositoryFactory.create(entityManager);
        const collectionResourceRepository = collectionResourceRepositoryFactory.create(entityManager);

        const { userId } = collectionTestDataGenerator.generateEntityData();
        const { url: url1 } = resourceTestDataGenerator.generateEntityData();
        const { url: url2 } = resourceTestDataGenerator.generateEntityData();

        const collection = await collectionRepository.createOne({ userId });

        const resource1 = await resourceRepository.createOne({ url: url1 });
        const resource2 = await resourceRepository.createOne({ url: url2 });

        await collectionResourceRepository.createOne({
          collectionId: collection.id,
          resourceId: resource1.id,
        });

        await collectionResourceRepository.createOne({
          collectionId: collection.id,
          resourceId: resource2.id,
        });

        const foundCollectionDto = await collectionService.findCollection(unitOfWork, collection.id);

        expect(foundCollectionDto.id).toBe(collection.id);
        expect(foundCollectionDto.userId).toBe(userId);
        expect(foundCollectionDto.resources).toEqual([resource1, resource2]);
      });
    });

    it('should throw if collection with given id does not exist', async () => {
      expect.assertions(1);

      const { id: nonExistingCollectionId } = collectionTestDataGenerator.generateEntityData();

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        try {
          await collectionService.findCollection(unitOfWork, nonExistingCollectionId);
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  describe('Update collection', () => {
    it('updates a collection in the database', async () => {
      expect.assertions(4);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();
        const domainEventsDispatcher = unitOfWork.getDomainEventsDispatcher();

        const collectionRepository = collectionRepositoryFactory.create(entityManager);

        const { title, userId } = collectionTestDataGenerator.generateEntityData();

        const collectionDtoBeforeUpdate = await collectionRepository.createOne({ userId });

        const collectionDtoAfterUpdate = await collectionService.updateCollection(
          unitOfWork,
          collectionDtoBeforeUpdate.id,
          {
            title,
          },
        );

        expect(collectionDtoAfterUpdate.title).toBe(title);

        const collectionInDb = await collectionRepository.findOneById(collectionDtoBeforeUpdate.id);

        expect(collectionInDb).not.toBeNull();

        const domainEvents = domainEventsDispatcher.getEvents();

        expect(domainEvents).toHaveLength(1);
        expect(domainEvents.at(0) instanceof CollectionUpdatedEvent).toBe(true);
      });
    });

    it('should throw if collection with given id does not exist', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { title, id: nonExistingCollectionId } = collectionTestDataGenerator.generateEntityData();

        try {
          await collectionService.updateCollection(unitOfWork, nonExistingCollectionId, { title });
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  describe('Remove collection', () => {
    it('removes collection from database', async () => {
      expect.assertions(3);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();
        const domainEventsDispatcher = unitOfWork.getDomainEventsDispatcher();

        const collectionRepository = collectionRepositoryFactory.create(entityManager);

        const { userId } = collectionTestDataGenerator.generateEntityData();

        const collectionDto = await collectionRepository.createOne({ userId });

        await collectionService.removeCollection(unitOfWork, collectionDto.id);

        const collectionInDb = await collectionRepository.findOneById(collectionDto.id);

        expect(collectionInDb).toBeNull();

        const domainEvents = domainEventsDispatcher.getEvents();

        expect(domainEvents).toHaveLength(1);
        expect(domainEvents.at(0) instanceof CollectionRemovedEvent).toBe(true);
      });
    });

    it('should throw if collection with given id does not exist', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { id: nonExistingCollectionId } = collectionTestDataGenerator.generateEntityData();

        try {
          await collectionService.removeCollection(unitOfWork, nonExistingCollectionId);
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });
  });
});
