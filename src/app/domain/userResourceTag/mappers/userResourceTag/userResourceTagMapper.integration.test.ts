import { TestingModule } from '@nestjs/testing';

import { Resource } from '@domain/resource/entities/resource';
import { ResourceTestFactory } from '@domain/resource/testFactories/resourceTestFactory';
import { Tag } from '@domain/tag/entities/tag';
import { TagTestFactory } from '@domain/tag/testFactories/tagTestFactory';
import { UserResource } from '@domain/userResource/entities/userResource';
import { PostgresHelper } from '@integration/helpers/postgresHelper/postgresHelper';
import { TestModuleHelper } from '@integration/helpers/testModuleHelper/testModuleHelper';

import { UserResourceTag } from '../../entities/userResourceTag';
import { UserResourceTagMapper } from './userResourceTagMapper';

describe('UserResourceMapper', () => {
  let testingModule: TestingModule;
  let postgresHelper: PostgresHelper;
  let userResourceTagMapper: UserResourceTagMapper;

  beforeEach(async () => {
    testingModule = await TestModuleHelper.createTestingModule();
    postgresHelper = new PostgresHelper(testingModule);
    userResourceTagMapper = testingModule.get(UserResourceTagMapper);
  });

  afterEach(async () => {
    await testingModule.close();
  });

  describe('Map user-resource-tag', () => {
    it('maps a user-resource-tag from entity to dto', async () => {
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

        await entityManager.save([tag]);

        const userResourceTag = entityManager.create(UserResourceTag, {
          tagId: tag.id,
          userResourceId: userResource.id,
        });

        const [savedUserResourceTag] = await entityManager.save([userResourceTag]);

        const userResourceTagDTO = userResourceTagMapper.mapEntityToDTO(savedUserResourceTag as UserResourceTag);

        expect(userResourceTagDTO).toEqual({
          id: savedUserResourceTag.id,
          createdAt: savedUserResourceTag.createdAt,
          updatedAt: savedUserResourceTag.updatedAt,
          userResourceId: userResource.id,
          tagId: tag.id,
        });
      });
    });
  });
});
