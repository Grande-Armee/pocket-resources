import { TestingModule } from '@nestjs/testing';

import { CollectionResource } from '@domain/collectionResource/entities/collectionResource';
import { Resource } from '@domain/resource/entities/resource';
import { ResourceMapper } from '@domain/resource/mappers/resource/resourceMapper';
import { ResourceTestDataGenerator } from '@domain/resource/testDataGenerators/resourceTestDataGenerator';
import { PostgresHelper } from '@integration/helpers/postgresHelper/postgresHelper';
import { TestModuleHelper } from '@integration/helpers/testModuleHelper/testModuleHelper';

import { Collection } from '../../entities/collection';
import { CollectionTestDataGenerator } from '../../testDataGenerators/collectionTestDataGenerator';
import { CollectionMapper } from './collectionMapper';

describe('CollectionMapper', () => {
  let testingModule: TestingModule;
  let postgresHelper: PostgresHelper;
  let collectionTestDataGenerator: CollectionTestDataGenerator;
  let resourceTestDataGenerator: ResourceTestDataGenerator;

  let resourceMapper: ResourceMapper;
  let collectionMapper: CollectionMapper;

  beforeEach(async () => {
    testingModule = await TestModuleHelper.createTestingModule();
    postgresHelper = new PostgresHelper(testingModule);
    collectionTestDataGenerator = new CollectionTestDataGenerator();
    resourceTestDataGenerator = new ResourceTestDataGenerator();

    resourceMapper = testingModule.get(ResourceMapper);
    collectionMapper = testingModule.get(CollectionMapper);
  });

  afterEach(async () => {
    await testingModule.close();
  });

  describe('Map collection', () => {
    it('maps a collection with optional fields from entity to dto', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();

        const { userId, title, thumbnailUrl, content } = collectionTestDataGenerator.generateEntityData();
        const { url } = resourceTestDataGenerator.generateEntityData();

        const collection = entityManager.create(Collection, { userId, title });

        await entityManager.save([collection]);

        const resource = entityManager.create(Resource, { url });

        await entityManager.save([resource]);

        const collectionResource = entityManager.create(CollectionResource, {
          collectionId: collection.id,
          resourceId: resource.id,
        });

        await entityManager.save([collectionResource]);

        await entityManager.update(Collection, { id: collection.id }, { title, thumbnailUrl, content });

        const queryBuilder = entityManager.getRepository(Collection).createQueryBuilder('collection');

        const updatedCollection = await queryBuilder
          .leftJoinAndSelect('collection.collectionResources', 'collectionResources')
          .leftJoinAndSelect('collectionResources.resource', 'resource')
          .where({ id: collection.id })
          .getOne();

        const collectionDto = collectionMapper.mapEntityToDto(updatedCollection as Collection);

        expect(collectionDto).toEqual({
          id: collection.id,
          createdAt: collection.createdAt,
          updatedAt: collection.updatedAt,
          title: title,
          thumbnailUrl: thumbnailUrl,
          content: content,
          userId: userId,
          resources: [resourceMapper.mapEntityToDto(resource)],
        });
      });
    });
  });
});
