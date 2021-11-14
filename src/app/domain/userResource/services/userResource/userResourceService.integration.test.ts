import { TestingModule } from '@nestjs/testing';

import { PostgresHelper } from '../../../../../integration/helpers/postgresHelper/postgresHelper';
import { TestModuleHelper } from '../../../../../integration/helpers/testModuleHelper/testModuleHelper';
import { ResourceService } from '../../../resource/services/resource/resourceService';
import { ResourceTestFactory } from '../../../resource/testFactories/resourceTestFactory';
import { TagRepositoryFactory } from '../../../tag/repositories/tag/tagRepository';
import { TagTestFactory } from '../../../tag/testFactories/tagTestFactory';
import { UserResourceTagRepositoryFactory } from '../../../userResourceTag/repositories/userResourceTag/userResourceTagRepository';
import { UserResourceRepositoryFactory } from '../../repositories/userResource/userResourceRepository';
import { UserResourceTestFactory } from '../../testFactories/userResourceTestFactory';
import { UserResourceService } from './userResourceService';

describe('UserResourceService', () => {
  let testingModule: TestingModule;
  let postgresHelper: PostgresHelper;

  let userResourceService: UserResourceService;
  let userResourceRepositoryFactory: UserResourceRepositoryFactory;

  let resourceService: ResourceService;

  let userResourceTagRepositoryFactory: UserResourceTagRepositoryFactory;

  let tagRepositoryFactory: TagRepositoryFactory;

  beforeEach(async () => {
    testingModule = await TestModuleHelper.createTestingModule();
    postgresHelper = new PostgresHelper(testingModule);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userResourceService = testingModule.get(UserResourceService);
    userResourceRepositoryFactory = testingModule.get(UserResourceRepositoryFactory);
    resourceService = testingModule.get(ResourceService);
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

        const userId = UserResourceTestFactory.createUserId();
        const url = ResourceTestFactory.createUrl();
        const color1 = TagTestFactory.createColor();
        const color2 = TagTestFactory.createColor();
        const title1 = ResourceTestFactory.createTitle();
        const title2 = ResourceTestFactory.createTitle();

        const resource = await resourceService.createResource(unitOfWork, { url });

        const tag1 = await tagRepository.createOne({
          userId,
          color: color1,
          title: title1,
        });

        const tag2 = await tagRepository.createOne({
          userId,
          color: color2,
          title: title2,
        });

        const userResource = await userResourceRepository.createOne({ resourceId: resource.id, userId: userId });

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
        expect(foundUserResourceDTO.userId).toBe(userId);
        expect(foundUserResourceDTO.resource).toEqual(resource);
        expect(foundUserResourceDTO.tags).toEqual([tag1, tag2]);
      });
    });

    it('should throw if user resource id not found', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const userResourceId = UserResourceTestFactory.createUserResourceId();

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

        const userId = UserResourceTestFactory.createUserId();
        const url = ResourceTestFactory.createUrl();

        const resource = await resourceService.createResource(unitOfWork, { url });

        const createdUserResourceDTO = await userResourceService.createUserResource(unitOfWork, {
          resourceId: resource.id,
          userId: userId,
        });

        expect(createdUserResourceDTO.resourceId).toBe(resource.id);
        expect(createdUserResourceDTO.userId).toBe(userId);

        const userResourceDTO = await userResourceRepository.findOneById(createdUserResourceDTO.id);

        expect(userResourceDTO).not.toBeNull();
      });
    });

    it('should not create user resource if userResource with same resourceId and userId exists', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();

        const userResourceRepository = userResourceRepositoryFactory.create(entityManager);

        const userId = UserResourceTestFactory.createUserId();
        const url = ResourceTestFactory.createUrl();

        const resource = await resourceService.createResource(unitOfWork, { url });

        await userResourceRepository.createOne({ resourceId: resource.id, userId: userId });

        try {
          await userResourceService.createUserResource(unitOfWork, { resourceId: resource.id, userId: userId });
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

        const userId = UserResourceTestFactory.createUserId();
        const url = ResourceTestFactory.createUrl();
        const rating = UserResourceTestFactory.createRating();

        const resource = await resourceService.createResource(unitOfWork, { url });

        const userResourceDTOBeforeUpdate = await userResourceRepository.createOne({
          resourceId: resource.id,
          userId: userId,
        });

        const userResourceDTOAfterUpdate = await userResourceService.updateUserResource(
          unitOfWork,
          userResourceDTOBeforeUpdate.id,
          {
            rating,
          },
        );

        expect(userResourceDTOAfterUpdate.rating).toBe(rating);

        const userResourceInDb = await userResourceRepository.findOneById(userResourceDTOBeforeUpdate.id);

        expect(userResourceInDb).not.toBeNull();
      });
    });

    it('should throw if user resource with given id does not exist', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const nonExistingId = UserResourceTestFactory.createUserResourceId();
        const rating = UserResourceTestFactory.createRating();

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

        const userId = UserResourceTestFactory.createUserId();
        const url = ResourceTestFactory.createUrl();

        const resource = await resourceService.createResource(unitOfWork, { url });

        const userResource = await userResourceRepository.createOne({ resourceId: resource.id, userId: userId });

        await userResourceService.removeUserResource(unitOfWork, userResource.id);

        const userResourceInDb = await userResourceRepository.findOneById(userResource.id);

        expect(userResourceInDb).toBeNull();
      });
    });

    it('should throw if user resource with given id does not exist', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const nonExistingId = UserResourceTestFactory.createUserResourceId();

        try {
          await userResourceService.removeUserResource(unitOfWork, nonExistingId);
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });
  });
});
