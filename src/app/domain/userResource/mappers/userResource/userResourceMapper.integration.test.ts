import { UserResourceStatus } from '@grande-armee/pocket-common';
import { TestingModule } from '@nestjs/testing';

import { Resource } from '@domain/resource/entities/resource';
import { ResourceMapper } from '@domain/resource/mappers/resource/resourceMapper';
import { ResourceTestDataGenerator } from '@domain/resource/testDataGenerators/resourceTestDataGenerator';
import { Tag } from '@domain/tag/entities/tag';
import { TagMapper } from '@domain/tag/mappers/tag/tagMapper';
import { TagTestDataGenerator } from '@domain/tag/testDataGenerators/tagTestDataGenerator';
import { UserResourceTag } from '@domain/userResourceTag/entities/userResourceTag';
import { PostgresHelper } from '@integration/helpers/postgresHelper/postgresHelper';
import { TestModuleHelper } from '@integration/helpers/testModuleHelper/testModuleHelper';

import { UserResource } from '../../entities/userResource';
import { UserResourceTestDataGenerator } from '../../testDataGenerators/userResourceTestDataGenerator';
import { UserResourceMapper } from './userResourceMapper';

describe('UserResourceMapper', () => {
  let testingModule: TestingModule;
  let postgresHelper: PostgresHelper;
  let resourceTestDataGenerator: ResourceTestDataGenerator;
  let userResourceTestDataGenerator: UserResourceTestDataGenerator;
  let tagTestDataGenerator: TagTestDataGenerator;

  let resourceMapper: ResourceMapper;
  let tagMapper: TagMapper;
  let userResourceMapper: UserResourceMapper;

  beforeEach(async () => {
    testingModule = await TestModuleHelper.createTestingModule();
    postgresHelper = new PostgresHelper(testingModule);
    userResourceTestDataGenerator = new UserResourceTestDataGenerator();
    resourceTestDataGenerator = new ResourceTestDataGenerator();
    tagTestDataGenerator = new TagTestDataGenerator();

    resourceMapper = testingModule.get(ResourceMapper);
    tagMapper = testingModule.get(TagMapper);
    userResourceMapper = testingModule.get(UserResourceMapper);
  });

  afterEach(async () => {
    await testingModule.close();
  });

  describe('Map userResource', () => {
    it('maps a userResource with resource and userResourceTag relation from entity to dto', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { entityManager } = unitOfWork;

        const resourceData = resourceTestDataGenerator.generateEntityData();
        const userResourceData = userResourceTestDataGenerator.generateEntityData();

        const { color, title } = tagTestDataGenerator.generateEntityData();

        const resource = entityManager.create(Resource, { url: resourceData.url });

        const [savedResource] = await entityManager.save([resource]);

        const userResource = entityManager.create(UserResource, {
          userId: userResourceData.userId,
          resourceId: resource.id,
        });

        await entityManager.save([userResource]);

        const tag = entityManager.create(Tag, {
          userId: userResourceData.userId,
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

        const userResourceDto = userResourceMapper.mapEntityToDto(userResourceEntity as UserResource);

        expect(userResourceDto).toEqual({
          id: userResource.id,
          createdAt: userResource.createdAt,
          updatedAt: userResource.updatedAt,
          isFavorite: false,
          rating: null,
          status: UserResourceStatus.toRead,
          resourceId: resource.id,
          userId: userResourceData.userId,
          resource: resourceMapper.mapEntityToDto(savedResource),
          tags: [tagMapper.mapEntityToDto(savedTag)],
        });
      });
    });

    it('maps a resource without userResourceTag relation from entity to dto', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { entityManager } = unitOfWork;

        const resourceData = resourceTestDataGenerator.generateEntityData();
        const userResourceData = userResourceTestDataGenerator.generateEntityData();

        const resource = entityManager.create(Resource, { url: resourceData.url });

        const [savedResource] = await entityManager.save([resource]);

        const userResource = entityManager.create(UserResource, {
          userId: userResourceData.userId,
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

        const userResourceDto = userResourceMapper.mapEntityToDto(userResourceEntity as UserResource);

        expect(userResourceDto).toEqual({
          id: userResource.id,
          createdAt: userResource.createdAt,
          updatedAt: userResource.updatedAt,
          isFavorite: false,
          rating: null,
          status: UserResourceStatus.toRead,
          resourceId: resource.id,
          userId: userResourceData.userId,
          resource: resourceMapper.mapEntityToDto(savedResource),
          tags: [],
        });
      });
    });

    it('maps a resource with optional fields to dto', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { entityManager } = unitOfWork;

        const resourceData = resourceTestDataGenerator.generateEntityData();
        const userResourceData = userResourceTestDataGenerator.generateEntityData();

        const resource = entityManager.create(Resource, { url: resourceData.url });

        const [savedResource] = await entityManager.save([resource]);

        const userResource = entityManager.create(UserResource, {
          userId: userResourceData.userId,
          resourceId: resource.id,
        });

        await entityManager.save([userResource]);

        await entityManager.update(
          UserResource,
          { id: userResource.id },
          {
            isFavorite: userResourceData.isFavorite,
            rating: userResourceData.rating,
            status: userResourceData.status,
          },
        );

        const queryBuilder = entityManager.getRepository(UserResource).createQueryBuilder('userResource');

        const userResourceEntity = await queryBuilder
          .leftJoinAndSelect('userResource.resource', 'resource')
          .leftJoinAndSelect('userResource.userResourceTags', 'userResourceTags')
          .leftJoinAndSelect('userResourceTags.tag', 'tag')
          .where({ id: userResource.id })
          .getOne();

        const userResourceDto = userResourceMapper.mapEntityToDto(userResourceEntity as UserResource);

        expect(userResourceDto).toEqual({
          id: userResource.id,
          createdAt: userResource.createdAt,
          updatedAt: userResource.updatedAt,
          isFavorite: userResourceData.isFavorite,
          rating: userResourceData.rating,
          status: userResourceData.status,
          resourceId: resource.id,
          userId: userResourceData.userId,
          resource: resourceMapper.mapEntityToDto(savedResource),
          tags: [],
        });
      });
    });
  });
});
