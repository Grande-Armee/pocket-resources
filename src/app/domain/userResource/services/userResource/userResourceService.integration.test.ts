import { TestingModule } from '@nestjs/testing';

import { ResourceRepositoryFactory } from '@domain/resource/repositories/resource/resourceRepository';
import { ResourceTestDataGenerator } from '@domain/resource/testDataGenerators/resourceTestDataGenerator';
import { TagRepositoryFactory } from '@domain/tag/repositories/tag/tagRepository';
import { TagTestDataGenerator } from '@domain/tag/testDataGenerators/tagTestDataGenerator';
import { UserResourceTagRepositoryFactory } from '@domain/userResourceTag/repositories/userResourceTag/userResourceTagRepository';
import { PostgresHelper } from '@integration/helpers/postgresHelper/postgresHelper';
import { TestModuleHelper } from '@integration/helpers/testModuleHelper/testModuleHelper';

import { UserResourceRepositoryFactory } from '../../repositories/userResource/userResourceRepository';
import { UserResourceTestDataGenerator } from '../../testDataGenerators/userResourceTestDataGenerator';
import { UserResourceService } from './userResourceService';

describe('UserResourceService', () => {
  let testingModule: TestingModule;
  let postgresHelper: PostgresHelper;
  let resourceTestDataGenerator: ResourceTestDataGenerator;
  let userResourceTestDataGenerator: UserResourceTestDataGenerator;
  let tagTestDataGenerator: TagTestDataGenerator;

  let userResourceService: UserResourceService;
  let userResourceRepositoryFactory: UserResourceRepositoryFactory;

  let resourceRepositoryFactory: ResourceRepositoryFactory;

  let userResourceTagRepositoryFactory: UserResourceTagRepositoryFactory;

  let tagRepositoryFactory: TagRepositoryFactory;

  beforeEach(async () => {
    testingModule = await TestModuleHelper.createTestingModule();
    postgresHelper = new PostgresHelper(testingModule);
    userResourceTestDataGenerator = new UserResourceTestDataGenerator();
    resourceTestDataGenerator = new ResourceTestDataGenerator();
    tagTestDataGenerator = new TagTestDataGenerator();

    userResourceService = testingModule.get(UserResourceService);
    userResourceRepositoryFactory = testingModule.get(UserResourceRepositoryFactory);
    resourceRepositoryFactory = testingModule.get(ResourceRepositoryFactory);
    userResourceTagRepositoryFactory = testingModule.get(UserResourceTagRepositoryFactory);
    tagRepositoryFactory = testingModule.get(TagRepositoryFactory);
  });

  afterEach(async () => {
    await testingModule.close();
  });

  describe('Find user resource', () => {
    it('gets user resource from the database', async () => {
      expect.assertions(4);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();
        const userResourceRepository = userResourceRepositoryFactory.create(entityManager);
        const userResourceTagRepository = userResourceTagRepositoryFactory.create(entityManager);
        const tagRepository = tagRepositoryFactory.create(entityManager);
        const resourceRepository = resourceRepositoryFactory.create(entityManager);

        const resourceData = resourceTestDataGenerator.generateEntityData();
        const userResourceData = userResourceTestDataGenerator.generateEntityData();

        const { color: color1, title: title1 } = tagTestDataGenerator.generateEntityData();
        const { color: color2, title: title2 } = tagTestDataGenerator.generateEntityData();

        const resource = await resourceRepository.createOne({ url: resourceData.url });

        const tag1 = await tagRepository.createOne({
          userId: userResourceData.userId,
          color: color1,
          title: title1,
        });

        const tag2 = await tagRepository.createOne({
          userId: userResourceData.userId,
          color: color2,
          title: title2,
        });

        const userResource = await userResourceRepository.createOne({
          resourceId: resource.id,
          userId: userResourceData.userId,
        });

        await userResourceTagRepository.createOne({
          tagId: tag1.id,
          userResourceId: userResource.id,
        });

        await userResourceTagRepository.createOne({
          tagId: tag2.id,
          userResourceId: userResource.id,
        });

        const foundUserResourceDto = await userResourceService.findUserResource(unitOfWork, {
          resourceId: resource.id,
          userId: userResourceData.userId,
        });

        expect(foundUserResourceDto.id).toBe(userResource.id);
        expect(foundUserResourceDto.userId).toBe(userResourceData.userId);
        expect(foundUserResourceDto.resource).toEqual(resource);
        expect(foundUserResourceDto.tags).toEqual([tag1, tag2]);
      });
    });

    it('should throw if user resource id not found', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { userId, resourceId } = userResourceTestDataGenerator.generateEntityData();

        try {
          await userResourceService.findUserResource(unitOfWork, { userId, resourceId });
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  describe('Create user resource', () => {
    it('creates user resource in database', async () => {
      expect.assertions(3);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();

        const userResourceRepository = userResourceRepositoryFactory.create(entityManager);
        const resourceRepository = resourceRepositoryFactory.create(entityManager);

        const resourceData = resourceTestDataGenerator.generateEntityData();
        const userResourceData = userResourceTestDataGenerator.generateEntityData();

        const resource = await resourceRepository.createOne({ url: resourceData.url });

        const createdUserResourceDto = await userResourceService.createUserResource(unitOfWork, {
          resourceId: resource.id,
          userId: userResourceData.userId,
        });

        expect(createdUserResourceDto.resourceId).toBe(resource.id);
        expect(createdUserResourceDto.userId).toBe(userResourceData.userId);

        const userResourceDto = await userResourceRepository.findOneById(createdUserResourceDto.id);

        expect(userResourceDto).not.toBeNull();
      });
    });

    it('should not create user resource if userResource with same resourceId and userId exists', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();

        const userResourceRepository = userResourceRepositoryFactory.create(entityManager);
        const resourceRepository = resourceRepositoryFactory.create(entityManager);

        const resourceData = resourceTestDataGenerator.generateEntityData();
        const userResourceData = userResourceTestDataGenerator.generateEntityData();

        const resource = await resourceRepository.createOne({ url: resourceData.url });

        await userResourceRepository.createOne({ resourceId: resource.id, userId: userResourceData.userId });

        try {
          await userResourceService.createUserResource(unitOfWork, {
            resourceId: resource.id,
            userId: userResourceData.userId,
          });
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  describe('Update user resource', () => {
    it('updates user resource in the database', async () => {
      expect.assertions(2);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();

        const userResourceRepository = userResourceRepositoryFactory.create(entityManager);
        const resourceRepository = resourceRepositoryFactory.create(entityManager);

        const resourceData = resourceTestDataGenerator.generateEntityData();
        const userResourceData = userResourceTestDataGenerator.generateEntityData();

        const resource = await resourceRepository.createOne({ url: resourceData.url });

        const userResourceDtoBeforeUpdate = await userResourceRepository.createOne({
          resourceId: resource.id,
          userId: userResourceData.userId,
        });

        const userResourceDtoAfterUpdate = await userResourceService.updateUserResource(
          unitOfWork,
          { resourceId: resource.id, userId: userResourceData.userId },
          {
            rating: userResourceData.rating,
          },
        );

        expect(userResourceDtoAfterUpdate.rating).toBe(userResourceData.rating);

        const userResourceInDb = await userResourceRepository.findOneById(userResourceDtoBeforeUpdate.id);

        expect(userResourceInDb).not.toBeNull();
      });
    });

    it('should throw if user resource with given id does not exist', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { userId, resourceId, rating } = userResourceTestDataGenerator.generateEntityData();

        try {
          await userResourceService.updateUserResource(
            unitOfWork,
            { userId, resourceId },
            {
              rating,
            },
          );
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  describe('Remove user resource', () => {
    it('removes user resource from database', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();

        const userResourceRepository = userResourceRepositoryFactory.create(entityManager);
        const resourceRepository = resourceRepositoryFactory.create(entityManager);

        const resourceData = resourceTestDataGenerator.generateEntityData();
        const userResourceData = userResourceTestDataGenerator.generateEntityData();

        const resource = await resourceRepository.createOne({ url: resourceData.url });

        const userResource = await userResourceRepository.createOne({
          resourceId: resource.id,
          userId: userResourceData.userId,
        });

        await userResourceService.removeUserResource(unitOfWork, {
          resourceId: resource.id,
          userId: userResourceData.userId,
        });

        const userResourceInDb = await userResourceRepository.findOneById(userResource.id);

        expect(userResourceInDb).toBeNull();
      });
    });

    it('should throw if user resource with given id does not exist', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { id: resourceId, userId } = userResourceTestDataGenerator.generateEntityData();

        try {
          await userResourceService.removeUserResource(unitOfWork, { resourceId, userId });
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });
  });
});
