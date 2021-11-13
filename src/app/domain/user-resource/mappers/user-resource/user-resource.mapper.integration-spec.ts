import { TestingModule } from '@nestjs/testing';

import { PostgresHelper } from '../../../../../integration-tests/helpers/postgres/postgres.helper';
import { TestModuleHelper } from '../../../../../integration-tests/helpers/test-module/test-module.helper';
import { Resource } from '../../../resource/entities/resource.entity';
import { ResourceTestFactory } from '../../../resource/tests-factories/resource.factory';
import { Tag } from '../../../tag/entities/tag.entity';
import { TagTestFactory } from '../../../tag/tests-factories/tag.factory';
import { UserResourceTag } from '../../../user-resource-tag/entities/user-resource-tag.entity';
import { UserResource } from '../../../user-resource/entities/user-resource.entity';
import { ResourceMapper } from './../../../resource/mappers/resource/resource.mapper';
import { TagMapper } from './../../../tag/mappers/tag/tag.mapper';
import { UserResourceMapper } from './user-resource.mapper';

describe('UserResourceMapper', () => {
  let testingModule: TestingModule;
  let postgresHelper: PostgresHelper;
  let resourceMapper: ResourceMapper;
  let tagMapper: TagMapper;
  let userResourceMapper: UserResourceMapper;

  beforeEach(async () => {
    testingModule = await TestModuleHelper.createTestingModule();
    postgresHelper = new PostgresHelper(testingModule);
    resourceMapper = new ResourceMapper();
    tagMapper = new TagMapper();
    userResourceMapper = new UserResourceMapper(resourceMapper, tagMapper);
  });

  afterEach(async () => {
    await testingModule.close();
  });

  describe('Map user-resource', () => {
    it('maps a user-resource with resource and user-resource-tag relation from entity to dto', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();

        const url = ResourceTestFactory.createUrl();
        const userId = ResourceTestFactory.createId();
        const color = TagTestFactory.createColor();
        const title = TagTestFactory.createTitle();

        const resource = entityManager.create(Resource, { url });

        const [savedResource] = await entityManager.save([resource]);

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

        const queryBuilder = entityManager.getRepository(UserResource).createQueryBuilder('userResource');

        const entity = await queryBuilder
          .leftJoinAndSelect('userResource.resource', 'resource')
          .leftJoinAndSelect('userResource.userResourceTags', 'userResourceTags')
          .leftJoinAndSelect('userResourceTags.tag', 'tag')
          .where({ id: userResource.id })
          .getOne();

        const userResourceDTO = userResourceMapper.mapEntityToDTO(entity as UserResource);

        expect(userResourceDTO).toEqual({
          id: userResource.id,
          createdAt: userResource.createdAt,
          updatedAt: userResource.updatedAt,
          resourceId: resource.id,
          userId: userId,
          resource: resourceMapper.mapEntityToDTO(savedResource),
          tags: [tagMapper.mapEntityToDTO(savedTag)],
        });
      });
    });

    // it('maps a resource with optional fields from entity to dto', async () => {
    //   expect.assertions(2);

    //   await postgresHelper.runInTestTransaction(async (unitOfWork) => {
    //     const entityManager = unitOfWork.getEntityManager();

    //     const url = ResourceTestFactory.createUrl();
    //     const title = ResourceTestFactory.createTitle();
    //     const thumbnailUrl = ResourceTestFactory.createUrl();
    //     const content = ResourceTestFactory.createContent();

    //     const resource = entityManager.create(Resource, { url });
    //     const [savedResource] = await entityManager.save([resource]);
    //     await entityManager.update(Resource, { id: savedResource.id }, { title, thumbnailUrl, content });
    //     const updatedResource = await entityManager.findOne(Resource, { id: savedResource.id });

    //     expect(updatedResource).toBeTruthy();
    //     const resourceDTO = userResourceMapper.mapEntityToDTO(updatedResource as Resource);

    //     expect(resourceDTO).toEqual({
    //       id: savedResource.id,
    //       createdAt: savedResource.createdAt,
    //       updatedAt: savedResource.updatedAt,
    //       url: url,
    //       title: title,
    //       thumbnailUrl: thumbnailUrl,
    //       content: content,
    //     });
    //   });
    // });
  });
});
