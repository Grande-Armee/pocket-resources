import { TestingModule } from '@nestjs/testing';

import { Resource } from '@domain/resource/entities/resource';
import { ResourceTestDataGenerator } from '@domain/resource/testDataGenerators/resourceTestDataGenerator';
import { UserResource } from '@domain/userResource/entities/userResource';
import { UserResourceTestDataGenerator } from '@domain/userResource/testDataGenerators/userResourceTestDataGenerator';
import { UserResourceTag } from '@domain/userResourceTag/entities/userResourceTag';
import { PostgresHelper } from '@integration/helpers/postgresHelper/postgresHelper';
import { TestModuleHelper } from '@integration/helpers/testModuleHelper/testModuleHelper';

import { Tag } from '../../entities/tag';
import { TagTestDataGenerator } from '../../testDataGenerators/tagTestDataGenerator';
import { TagMapper } from './tagMapper';

describe('TagMapper', () => {
  let testingModule: TestingModule;
  let postgresHelper: PostgresHelper;
  let resourceTestDataGenerator: ResourceTestDataGenerator;
  let userResourceTestDataGenerator: UserResourceTestDataGenerator;
  let tagTestDataGenerator: TagTestDataGenerator;

  let tagMapper: TagMapper;

  beforeEach(async () => {
    testingModule = await TestModuleHelper.createTestingModule();
    postgresHelper = new PostgresHelper(testingModule);
    userResourceTestDataGenerator = new UserResourceTestDataGenerator();
    resourceTestDataGenerator = new ResourceTestDataGenerator();
    tagTestDataGenerator = new TagTestDataGenerator();

    tagMapper = testingModule.get(TagMapper);
  });

  afterEach(async () => {
    await testingModule.close();
  });

  describe('Map tag', () => {
    it('maps a tag with userResourceTag relation from entity to dto', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();

        const { url } = resourceTestDataGenerator.generateEntityData();
        const { userId } = userResourceTestDataGenerator.generateEntityData();
        const { color, title } = tagTestDataGenerator.generateEntityData();

        const resource = entityManager.create(Resource, { url });

        await entityManager.save([resource]);

        const userResource = entityManager.create(UserResource, {
          userId: userId,
          resourceId: resource.id,
        });

        await entityManager.save([userResource]);

        const tag = entityManager.create(Tag, {
          userId,
          color: color,
          title: title,
        });

        const [savedTag] = await entityManager.save([tag]);

        const userResourceTag = entityManager.create(UserResourceTag, {
          tagId: tag.id,
          userResourceId: userResource.id,
        });

        await entityManager.save([userResourceTag]);

        const tagDto = tagMapper.mapEntityToDto(savedTag);

        expect(tagDto).toEqual({
          id: tag.id,
          createdAt: tag.createdAt,
          updatedAt: tag.updatedAt,
          color: color,
          title: title,
          userId: userId,
        });
      });
    });
  });
});
