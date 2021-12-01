import { TestingModule } from '@nestjs/testing';

import { Collection } from '@domain/collection/entities/collection';
import { CollectionTestDataGenerator } from '@domain/collection/testDataGenerators/collectionTestDataGenerator';
import { Resource } from '@domain/resource/entities/resource';
import { ResourceTestDataGenerator } from '@domain/resource/testDataGenerators/resourceTestDataGenerator';
import { PostgresHelper } from '@integration/helpers/postgresHelper/postgresHelper';
import { TestModuleHelper } from '@integration/helpers/testModuleHelper/testModuleHelper';

import { CollectionResource } from '../../entities/collectionResource';
import { CollectionResourceMapper } from './collectionResourceMapper';

describe('CollectionResourceMapper', () => {
  let testingModule: TestingModule;
  let postgresHelper: PostgresHelper;
  let resourceTestDataGenerator: ResourceTestDataGenerator;
  let collectionTestDataGenerator: CollectionTestDataGenerator;

  let collectionResourceMapper: CollectionResourceMapper;

  beforeEach(async () => {
    testingModule = await TestModuleHelper.createTestingModule();
    postgresHelper = new PostgresHelper(testingModule);
    collectionTestDataGenerator = new CollectionTestDataGenerator();
    resourceTestDataGenerator = new ResourceTestDataGenerator();

    collectionResourceMapper = testingModule.get(CollectionResourceMapper);
  });

  afterEach(async () => {
    await testingModule.close();
  });

  describe('Map collectionResource', () => {
    it('maps a collectionResource from entity to dto', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { entityManager } = unitOfWork;

        const { url } = resourceTestDataGenerator.generateEntityData();
        const { userId, title } = collectionTestDataGenerator.generateEntityData();

        const resource = entityManager.create(Resource, { url });

        await entityManager.save([resource]);

        const collection = entityManager.create(Collection, {
          userId,
          title,
        });

        await entityManager.save([collection]);

        const collectionResource = entityManager.create(CollectionResource, {
          collectionId: collection.id,
          resourceId: resource.id,
        });

        const [savedCollectionResource] = await entityManager.save([collectionResource]);

        const collectionResourceDto = collectionResourceMapper.mapEntityToDto(
          savedCollectionResource as CollectionResource,
        );

        expect(collectionResourceDto).toEqual({
          id: savedCollectionResource.id,
          createdAt: savedCollectionResource.createdAt,
          updatedAt: savedCollectionResource.updatedAt,
          collectionId: collection.id,
          resourceId: resource.id,
        });
      });
    });
  });
});
