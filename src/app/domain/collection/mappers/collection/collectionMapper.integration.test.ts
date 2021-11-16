import { TestingModule } from '@nestjs/testing';

import { PostgresHelper } from '@integration/helpers/postgresHelper/postgresHelper';
import { TestModuleHelper } from '@integration/helpers/testModuleHelper/testModuleHelper';

import { Collection } from '../../entities/collection';
import { CollectionTestDataGenerator } from '../../testDataGenerators/collectionTestDataGenerator';
import { CollectionMapper } from './collectionMapper';

describe('CollectionMapper', () => {
  let testingModule: TestingModule;
  let postgresHelper: PostgresHelper;
  let collectionTestDataGenerator: CollectionTestDataGenerator;

  let collectionMapper: CollectionMapper;

  beforeEach(async () => {
    testingModule = await TestModuleHelper.createTestingModule();
    postgresHelper = new PostgresHelper(testingModule);
    collectionTestDataGenerator = new CollectionTestDataGenerator();

    collectionMapper = testingModule.get(CollectionMapper);
  });

  afterEach(async () => {
    await testingModule.close();
  });

  describe('Map collection', () => {
    it('maps a collection with optional fields from entity to dto', async () => {
      expect.assertions(2);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();

        const { userId, title, thumbnailUrl, content } = collectionTestDataGenerator.generateEntityData();

        const collection = entityManager.create(Collection, { userId });

        const [savedCollection] = await entityManager.save([collection]);

        await entityManager.update(Collection, { id: savedCollection.id }, { title, thumbnailUrl, content });

        const updatedCollection = await entityManager.findOne(Collection, { id: savedCollection.id });

        expect(updatedCollection).toBeTruthy();

        const collectionDto = collectionMapper.mapEntityToDto(updatedCollection as Collection);

        expect(collectionDto).toEqual({
          id: savedCollection.id,
          createdAt: savedCollection.createdAt,
          updatedAt: savedCollection.updatedAt,
          title: title,
          thumbnailUrl: thumbnailUrl,
          content: content,
          userId: userId,
        });
      });
    });
  });
});
