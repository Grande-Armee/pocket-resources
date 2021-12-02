import { TestingModule } from '@nestjs/testing';

import { CollectionRepositoryFactory } from '@domain/collection/repositories/collection/collectionRepository';
import { CollectionTestDataGenerator } from '@domain/collection/testDataGenerators/collectionTestDataGenerator';
import { CollectionResourceRepositoryFactory } from '@domain/collectionResource/repositories/collectionResource/collectionResourceRepository';
import { ResourceRepositoryFactory } from '@domain/resource/repositories/resource/resourceRepository';
import { ResourceTestDataGenerator } from '@domain/resource/testDataGenerators/resourceTestDataGenerator';
import { PostgresHelper } from '@integration/helpers/postgresHelper/postgresHelper';
import { TestModuleHelper } from '@integration/helpers/testModuleHelper/testModuleHelper';

import { CollectionResourceTestDataGenerator } from '../../testDataGenerators/collectionResourceTestDataGenerator';
import { CollectionResourceService } from './collectionResourceService';

describe('CollectionResourceService', () => {
  let testingModule: TestingModule;
  let postgresHelper: PostgresHelper;
  let resourceTestDataGenerator: ResourceTestDataGenerator;
  let collectionResourceTestDataGenerator: CollectionResourceTestDataGenerator;
  let collectionTestDataGenerator: CollectionTestDataGenerator;

  let collectionResourceService: CollectionResourceService;
  let collectionResourceRepositoryFactory: CollectionResourceRepositoryFactory;

  let resourceRepositoryFactory: ResourceRepositoryFactory;

  let collectionRepositoryFactory: CollectionRepositoryFactory;

  beforeEach(async () => {
    testingModule = await TestModuleHelper.createTestingModule();
    postgresHelper = new PostgresHelper(testingModule);
    resourceTestDataGenerator = new ResourceTestDataGenerator();
    collectionResourceTestDataGenerator = new CollectionResourceTestDataGenerator();
    collectionTestDataGenerator = new CollectionTestDataGenerator();

    collectionResourceService = testingModule.get(CollectionResourceService);
    collectionResourceRepositoryFactory = testingModule.get(CollectionResourceRepositoryFactory);
    resourceRepositoryFactory = testingModule.get(ResourceRepositoryFactory);
    collectionRepositoryFactory = testingModule.get(CollectionRepositoryFactory);
  });

  afterEach(async () => {
    await testingModule.close();
  });

  describe('Find collection resource', () => {
    it('gets collection resource from the database', async () => {
      expect.assertions(3);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { entityManager } = unitOfWork;
        const collectionResourceRepository = collectionResourceRepositoryFactory.create(entityManager);
        const resourceRepository = resourceRepositoryFactory.create(entityManager);
        const collectionRepository = collectionRepositoryFactory.create(entityManager);

        const resourceData = resourceTestDataGenerator.generateEntityData();
        const { userId, title } = collectionTestDataGenerator.generateEntityData();

        const resource = await resourceRepository.createOne({ url: resourceData.url });

        const collection = await collectionRepository.createOne({ userId: userId, title });

        const collectionResource = await collectionResourceRepository.createOne({
          collectionId: collection.id,
          resourceId: resource.id,
        });

        const foundCollectionResourceDto = await collectionResourceService.findCollectionResource(
          unitOfWork,
          collectionResource.id,
        );

        expect(foundCollectionResourceDto.id).toBe(collectionResource.id);
        expect(foundCollectionResourceDto.collectionId).toBe(collection.id);
        expect(foundCollectionResourceDto.resourceId).toBe(resource.id);
      });
    });

    it('should throw if collection resource id not found', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { id: nonExistingCollectionResourceId } = collectionResourceTestDataGenerator.generateEntityData();

        try {
          await collectionResourceService.findCollectionResource(unitOfWork, nonExistingCollectionResourceId);
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  describe('Create collection resource', () => {
    it('creates collection resource in database', async () => {
      expect.assertions(3);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { entityManager } = unitOfWork;
        const collectionResourceRepository = collectionResourceRepositoryFactory.create(entityManager);
        const resourceRepository = resourceRepositoryFactory.create(entityManager);
        const collectionRepository = collectionRepositoryFactory.create(entityManager);

        const resourceData = resourceTestDataGenerator.generateEntityData();
        const { userId, title } = collectionTestDataGenerator.generateEntityData();

        const resource = await resourceRepository.createOne({ url: resourceData.url });

        const collection = await collectionRepository.createOne({ userId, title });

        const createdCollectionResourceDto = await collectionResourceService.createCollectionResource(unitOfWork, {
          collectionId: collection.id,
          resourceId: resource.id,
        });

        expect(createdCollectionResourceDto.collectionId).toBe(collection.id);
        expect(createdCollectionResourceDto.resourceId).toBe(resource.id);

        const collectionResourceInDb = await collectionResourceRepository.findOneById(createdCollectionResourceDto.id);

        expect(collectionResourceInDb).not.toBeNull();
      });
    });

    it('should not create collection resource if collectionResource with same resourceId and collectionId exists', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { entityManager } = unitOfWork;
        const collectionResourceRepository = collectionResourceRepositoryFactory.create(entityManager);
        const resourceRepository = resourceRepositoryFactory.create(entityManager);
        const collectionRepository = collectionRepositoryFactory.create(entityManager);

        const resourceData = resourceTestDataGenerator.generateEntityData();
        const { userId, title } = collectionTestDataGenerator.generateEntityData();

        const resource = await resourceRepository.createOne({ url: resourceData.url });

        const collection = await collectionRepository.createOne({ userId, title });

        await collectionResourceRepository.createOne({
          collectionId: collection.id,
          resourceId: resource.id,
        });

        try {
          await collectionResourceService.createCollectionResource(unitOfWork, {
            collectionId: collection.id,
            resourceId: resource.id,
          });
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  describe('Remove collection resource', () => {
    it('removes collection resource from database', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { entityManager } = unitOfWork;
        const collectionResourceRepository = collectionResourceRepositoryFactory.create(entityManager);
        const resourceRepository = resourceRepositoryFactory.create(entityManager);
        const collectionRepository = collectionRepositoryFactory.create(entityManager);

        const resourceData = resourceTestDataGenerator.generateEntityData();
        const { userId, title } = collectionTestDataGenerator.generateEntityData();

        const resource = await resourceRepository.createOne({ url: resourceData.url });

        const collection = await collectionRepository.createOne({ userId, title });

        const collectionResource = await collectionResourceRepository.createOne({
          collectionId: collection.id,
          resourceId: resource.id,
        });

        await collectionResourceService.removeCollectionResource(unitOfWork, {
          collectionId: collection.id,
          resourceId: resource.id,
        });

        const collectionResourceInDb = await collectionResourceRepository.findOneById(collectionResource.id);

        expect(collectionResourceInDb).toBeNull();
      });
    });

    it('should throw if collection resource with given id does not exist', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { collectionId: nonExistingCollectionId, resourceId: nonExistingResourceId } =
          collectionResourceTestDataGenerator.generateEntityData();

        try {
          await collectionResourceService.removeCollectionResource(unitOfWork, {
            collectionId: nonExistingCollectionId,
            resourceId: nonExistingResourceId,
          });
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });
  });
});
