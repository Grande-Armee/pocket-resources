import { TestingModule } from '@nestjs/testing';

import { PostgresHelper } from '../../../../../integration-tests/helpers/postgres/postgres.helper';
import { TestModuleHelper } from '../../../../../integration-tests/helpers/test-module/test-module.helper';
import { Resource } from '../../../resource/entities/resource.entity';
import { ResourceTestFactory } from '../../../resource/tests-factories/resource.factory';
import { Tag } from '../../../tag/entities/tag.entity';
import { TagTestFactory } from '../../../tag/tests-factories/tag.factory';
import { UserResourceTag } from '../../../user-resource-tag/entities/user-resource-tag.entity';
import { UserResource } from '../../../user-resource/entities/user-resource.entity';
import { UserResourceTestFactory } from '../../tests-factories/user-resource.factory';
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
    resourceMapper = testingModule.get(ResourceMapper);
    tagMapper = testingModule.get(TagMapper);
    userResourceMapper = testingModule.get(UserResourceMapper);
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

        const userResourceEntity = await queryBuilder
          .leftJoinAndSelect('userResource.resource', 'resource')
          .leftJoinAndSelect('userResource.userResourceTags', 'userResourceTags')
          .leftJoinAndSelect('userResourceTags.tag', 'tag')
          .where({ id: userResource.id })
          .getOne();

        const userResourceDTO = userResourceMapper.mapEntityToDTO(userResourceEntity as UserResource);

        expect(userResourceDTO).toEqual({
          id: userResource.id,
          createdAt: userResource.createdAt,
          updatedAt: userResource.updatedAt,
          isFavorite: false,
          rating: null,
          status: 'TO_READ',
          resourceId: resource.id,
          userId: userId,
          resource: resourceMapper.mapEntityToDTO(savedResource),
          tags: [tagMapper.mapEntityToDTO(savedTag)],
        });
      });
    });

    it('maps a resource without user-resource-tag relation from entity to dto', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();

        const url = ResourceTestFactory.createUrl();
        const userId = ResourceTestFactory.createId();

        const resource = entityManager.create(Resource, { url });

        const [savedResource] = await entityManager.save([resource]);

        const userResource = entityManager.create(UserResource, {
          userId: userId,
          resourceId: resource.id,
        });

        await entityManager.save([userResource]);

        const queryBuilder = entityManager.getRepository(UserResource).createQueryBuilder('userResource');

        const userResourceEntity = await queryBuilder
          .leftJoinAndSelect('userResource.resource', 'resource')
          .leftJoinAndSelect('userResource.userResourceTags', 'userResourceTags')
          .leftJoinAndSelect('userResourceTags.tag', 'tag')
          .where({ id: userResource.id })
          .getOne();

        const userResourceDTO = userResourceMapper.mapEntityToDTO(userResourceEntity as UserResource);

        expect(userResourceDTO).toEqual({
          id: userResource.id,
          createdAt: userResource.createdAt,
          updatedAt: userResource.updatedAt,
          isFavorite: false,
          rating: null,
          status: 'TO_READ',
          resourceId: resource.id,
          userId: userId,
          resource: resourceMapper.mapEntityToDTO(savedResource),
          tags: [],
        });
      });
    });

    it('maps a resource with optional fields to dto', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();

        const url = ResourceTestFactory.createUrl();
        const userId = ResourceTestFactory.createId();
        const isFavorite = UserResourceTestFactory.createIsFavorite();
        const rating = UserResourceTestFactory.createRating();
        const status = UserResourceTestFactory.createStatus();

        const resource = entityManager.create(Resource, { url });

        const [savedResource] = await entityManager.save([resource]);

        const userResource = entityManager.create(UserResource, {
          userId: userId,
          resourceId: resource.id,
        });

        await entityManager.save([userResource]);

        await entityManager.update(UserResource, { id: userResource.id }, { isFavorite, rating, status });

        const queryBuilder = entityManager.getRepository(UserResource).createQueryBuilder('userResource');

        const userResourceEntity = await queryBuilder
          .leftJoinAndSelect('userResource.resource', 'resource')
          .leftJoinAndSelect('userResource.userResourceTags', 'userResourceTags')
          .leftJoinAndSelect('userResourceTags.tag', 'tag')
          .where({ id: userResource.id })
          .getOne();

        const userResourceDTO = userResourceMapper.mapEntityToDTO(userResourceEntity as UserResource);

        expect(userResourceDTO).toEqual({
          id: userResource.id,
          createdAt: userResource.createdAt,
          updatedAt: userResource.updatedAt,
          isFavorite: isFavorite,
          rating: rating,
          status: status,
          resourceId: resource.id,
          userId: userId,
          resource: resourceMapper.mapEntityToDTO(savedResource),
          tags: [],
        });
      });
    });
  });
});
