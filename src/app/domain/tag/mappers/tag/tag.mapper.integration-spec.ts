import { TestingModule } from '@nestjs/testing';

import { PostgresHelper } from '../../../../../integration-tests/helpers/postgres/postgres.helper';
import { TestModuleHelper } from '../../../../../integration-tests/helpers/test-module/test-module.helper';
import { Resource } from '../../../resource/entities/resource.entity';
import { ResourceTestFactory } from '../../../resource/tests-factories/resource.factory';
import { UserResourceTag } from '../../../user-resource-tag/entities/user-resource-tag.entity';
import { UserResource } from '../../../user-resource/entities/user-resource.entity';
import { Tag } from '../../entities/tag.entity';
import { TagTestFactory } from '../../tests-factories/tag.factory';
import { TagMapper } from './tag.mapper';

describe('TagMapper', () => {
  let testingModule: TestingModule;
  let postgresHelper: PostgresHelper;
  let tagMapper: TagMapper;

  beforeEach(async () => {
    testingModule = await TestModuleHelper.createTestingModule();
    postgresHelper = new PostgresHelper(testingModule);
    tagMapper = new TagMapper();
  });

  afterEach(async () => {
    await testingModule.close();
  });

  describe('Map tag', () => {
    it('maps a tag with user-resource-tag relation from entity to dto', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();

        const url = ResourceTestFactory.createUrl();
        const userId = ResourceTestFactory.createId();
        const color = TagTestFactory.createColor();
        const title = TagTestFactory.createTitle();

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

        const tagDTO = tagMapper.mapEntityToDTO(savedTag);

        expect(tagDTO).toEqual({
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
