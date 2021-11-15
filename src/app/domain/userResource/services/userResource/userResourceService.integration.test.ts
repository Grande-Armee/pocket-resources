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

        const foundUserResourceDTO = await userResourceService.findUserResource(unitOfWork, userResource.id);

        expect(foundUserResourceDTO.id).toBe(userResource.id);
        expect(foundUserResourceDTO.userId).toBe(userResourceData.userId);
        expect(foundUserResourceDTO.resource).toEqual(resource);
        expect(foundUserResourceDTO.tags).toEqual([tag1, tag2]);
      });
    });

    it('should throw if user resource id not found', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { id: userResourceId } = userResourceTestDataGenerator.generateEntityData();

        try {
          await userResourceService.findUserResource(unitOfWork, userResourceId);
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

        const createdUserResourceDTO = await userResourceService.createUserResource(unitOfWork, {
          resourceId: resource.id,
          userId: userResourceData.userId,
        });

        expect(createdUserResourceDTO.resourceId).toBe(resource.id);
        expect(createdUserResourceDTO.userId).toBe(userResourceData.userId);

        const userResourceDTO = await userResourceRepository.findOneById(createdUserResourceDTO.id);

        expect(userResourceDTO).not.toBeNull();
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

        const userResourceDTOBeforeUpdate = await userResourceRepository.createOne({
          resourceId: resource.id,
          userId: userResourceData.userId,
        });

        const userResourceDTOAfterUpdate = await userResourceService.updateUserResource(
          unitOfWork,
          userResourceDTOBeforeUpdate.id,
          {
            rating: userResourceData.rating,
          },
        );

        expect(userResourceDTOAfterUpdate.rating).toBe(userResourceData.rating);

        const userResourceInDb = await userResourceRepository.findOneById(userResourceDTOBeforeUpdate.id);

        expect(userResourceInDb).not.toBeNull();
      });
    });

    it('should throw if user resource with given id does not exist', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { id: nonExistingId, rating } = userResourceTestDataGenerator.generateEntityData();

        try {
          await userResourceService.updateUserResource(unitOfWork, nonExistingId, {
            rating,
          });
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

        await userResourceService.removeUserResource(unitOfWork, userResource.id);

        const userResourceInDb = await userResourceRepository.findOneById(userResource.id);

        expect(userResourceInDb).toBeNull();
      });
    });

    it('should throw if user resource with given id does not exist', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { id: nonExistingId } = userResourceTestDataGenerator.generateEntityData();

        try {
          await userResourceService.removeUserResource(unitOfWork, nonExistingId);
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });
  });
});
