import { Test, TestingModule } from '@nestjs/testing';

import { CollectionResourceRepositoryFactory } from '@domain/collectionResource/repositories/collectionResource/collectionResourceRepository';
import { DomainModule } from '@domain/domainModule';
import { ResourceRepositoryFactory } from '@domain/resource/repositories/resource/resourceRepository';
import { ResourceTestDataGenerator } from '@domain/resource/testDataGenerators/resourceTestDataGenerator';
import { PostgresHelper } from '@integration/helpers/postgresHelper/postgresHelper';
import { DatabaseModule } from '@shared/database/databaseModule';
import { UnitOfWorkModule } from '@shared/unitOfWork/unitOfWorkModule';

import { CollectionCreatedEvent, CollectionRemovedEvent, CollectionUpdatedEvent } from '../../integrationEvents';
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
    testingModule = await Test.createTestingModule({
      imports: [DatabaseModule, UnitOfWorkModule, DomainModule],
    }).compile();

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
      expect.assertions(5);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { entityManager, integrationEventsStore } = unitOfWork;

        const collectionRepository = collectionRepositoryFactory.create(entityManager);

        const { userId, title } = collectionTestDataGenerator.generateEntityData();

        const createdCollectionDto = await collectionService.createCollection(unitOfWork, { userId, title });

        expect(createdCollectionDto.userId).toBe(userId);
        expect(createdCollectionDto.title).toBe(title);

        const collectionDto = await collectionRepository.findOneById(createdCollectionDto.id);

        expect(collectionDto).not.toBeNull();

        const integrationEvents = integrationEventsStore.getEvents();

        expect(integrationEvents).toHaveLength(1);
        expect(integrationEvents.at(0) instanceof CollectionCreatedEvent).toBe(true);
      });
    });
  });

  describe('Find collection', () => {
    it('should return collection if collection with given id exists', async () => {
      expect.assertions(3);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { entityManager } = unitOfWork;

        const collectionRepository = collectionRepositoryFactory.create(entityManager);
        const resourceRepository = resourceRepositoryFactory.create(entityManager);
        const collectionResourceRepository = collectionResourceRepositoryFactory.create(entityManager);

        const { userId, title } = collectionTestDataGenerator.generateEntityData();
        const { url: url1 } = resourceTestDataGenerator.generateEntityData();
        const { url: url2 } = resourceTestDataGenerator.generateEntityData();

        const collection = await collectionRepository.createOne({ userId, title });

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
      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { id: nonExistingCollectionId } = collectionTestDataGenerator.generateEntityData();

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
        const { entityManager, integrationEventsStore } = unitOfWork;

        const collectionRepository = collectionRepositoryFactory.create(entityManager);

        const { title, userId } = collectionTestDataGenerator.generateEntityData();

        const collectionDtoBeforeUpdate = await collectionRepository.createOne({ userId, title });

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

        const integrationEvents = integrationEventsStore.getEvents();

        expect(integrationEvents).toHaveLength(1);
        expect(integrationEvents.at(0) instanceof CollectionUpdatedEvent).toBe(true);
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
        const { entityManager, integrationEventsStore } = unitOfWork;

        const collectionRepository = collectionRepositoryFactory.create(entityManager);

        const { userId, title } = collectionTestDataGenerator.generateEntityData();

        const collectionDto = await collectionRepository.createOne({ userId, title });

        await collectionService.removeCollection(unitOfWork, collectionDto.id);

        const collectionInDb = await collectionRepository.findOneById(collectionDto.id);

        expect(collectionInDb).toBeNull();

        const integrationEvents = integrationEventsStore.getEvents();

        expect(integrationEvents).toHaveLength(1);
        expect(integrationEvents.at(0) instanceof CollectionRemovedEvent).toBe(true);
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
