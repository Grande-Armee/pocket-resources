import { TestingModule } from '@nestjs/testing';

import { ResourceRepositoryFactory } from '@domain/resource/repositories/resource/resourceRepository';
import { ResourceTestDataGenerator } from '@domain/resource/testDataGenerators/resourceTestDataGenerator';
import { TagRepositoryFactory } from '@domain/tag/repositories/tag/tagRepository';
import { TagTestDataGenerator } from '@domain/tag/testDataGenerators/tagTestDataGenerator';
import { UserResourceRepositoryFactory } from '@domain/userResource/repositories/userResource/userResourceRepository';
import { UserResourceTestDataGenerator } from '@domain/userResource/testDataGenerators/userResourceTestDataGenerator';
import { UserResourceTagRepositoryFactory } from '@domain/userResourceTag/repositories/userResourceTag/userResourceTagRepository';
import { PostgresHelper } from '@integration/helpers/postgresHelper/postgresHelper';
import { TestModuleHelper } from '@integration/helpers/testModuleHelper/testModuleHelper';

import { UserResourceTagTestDataGenerator } from '../../testDataGenerators/userResourceTagTestDataGenerator';
import { UserResourceTagService } from './userResourceTagService';

describe('UserResourceTagService', () => {
  let testingModule: TestingModule;
  let postgresHelper: PostgresHelper;
  let resourceTestDataGenerator: ResourceTestDataGenerator;
  let tagTestDataGenerator: TagTestDataGenerator;
  let userResourceTestDataGenerator: UserResourceTestDataGenerator;
  let userResourceTagTestDataGenerator: UserResourceTagTestDataGenerator;

  let userResourceTagService: UserResourceTagService;
  let userResourceTagRepositoryFactory: UserResourceTagRepositoryFactory;

  let userResourceRepositoryFactory: UserResourceRepositoryFactory;

  let resourceRepositoryFactory: ResourceRepositoryFactory;

  let tagRepositoryFactory: TagRepositoryFactory;

  beforeEach(async () => {
    testingModule = await TestModuleHelper.createTestingModule();
    postgresHelper = new PostgresHelper(testingModule);
    resourceTestDataGenerator = new ResourceTestDataGenerator();
    tagTestDataGenerator = new TagTestDataGenerator();
    userResourceTestDataGenerator = new UserResourceTestDataGenerator();
    userResourceTagTestDataGenerator = new UserResourceTagTestDataGenerator();

    userResourceTagService = testingModule.get(UserResourceTagService);
    userResourceTagRepositoryFactory = testingModule.get(UserResourceTagRepositoryFactory);
    userResourceRepositoryFactory = testingModule.get(UserResourceRepositoryFactory);
    resourceRepositoryFactory = testingModule.get(ResourceRepositoryFactory);
    tagRepositoryFactory = testingModule.get(TagRepositoryFactory);
  });

  afterEach(async () => {
    await testingModule.close();
  });

  describe('Create user resource tag', () => {
    // TODO: restore create user resource tag success test
    it('should not create user resource tag if userResourceTag with same userResourceId and tagId exists', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();

        const userResourceRepository = userResourceRepositoryFactory.create(entityManager);
        const resourceRepository = resourceRepositoryFactory.create(entityManager);
        const tagRepository = tagRepositoryFactory.create(entityManager);
        const userResourceTagRepository = userResourceTagRepositoryFactory.create(entityManager);

        const resourceData = resourceTestDataGenerator.generateEntityData();
        const userResourceData = userResourceTestDataGenerator.generateEntityData();

        const { color: color1, title: title1 } = tagTestDataGenerator.generateEntityData();

        const resource = await resourceRepository.createOne({ url: resourceData.url });

        const tag1 = await tagRepository.createOne({
          userId: userResourceData.userId,
          color: color1,
          title: title1,
        });

        const userResource = await userResourceRepository.createOne({
          resourceId: resource.id,
          userId: userResourceData.userId,
        });

        await userResourceTagRepository.createOne({
          tagId: tag1.id,
          userResourceId: userResource.id,
        });

        try {
          await userResourceTagService.createUserResourceTag(unitOfWork, {
            tagId: tag1.id,
            userId: userResourceData.userId,
            resourceId: resource.id,
          });
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });
  });

  describe('Remove user resource tag', () => {
    it('removes user resource tag from database', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();

        const userResourceRepository = userResourceRepositoryFactory.create(entityManager);
        const resourceRepository = resourceRepositoryFactory.create(entityManager);
        const tagRepository = tagRepositoryFactory.create(entityManager);
        const userResourceTagRepository = userResourceTagRepositoryFactory.create(entityManager);

        const resourceData = resourceTestDataGenerator.generateEntityData();
        const userResourceData = userResourceTestDataGenerator.generateEntityData();

        const { color: color1, title: title1 } = tagTestDataGenerator.generateEntityData();

        const resource = await resourceRepository.createOne({ url: resourceData.url });

        const tag1 = await tagRepository.createOne({
          userId: userResourceData.userId,
          color: color1,
          title: title1,
        });

        const userResource = await userResourceRepository.createOne({
          resourceId: resource.id,
          userId: userResourceData.userId,
        });

        const userResourceTag = await userResourceTagRepository.createOne({
          tagId: tag1.id,
          userResourceId: userResource.id,
        });

        await userResourceTagService.removeUserResourceTag(unitOfWork, userResourceTag.id);

        const userResourceTagInDb = await userResourceRepository.findOneById(userResourceTag.id);

        expect(userResourceTagInDb).toBeNull();
      });
    });

    it('should throw if user resource tag with given id does not exist', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { id: nonExistingUserResourceTagId } = userResourceTagTestDataGenerator.generateEntityData();

        try {
          await userResourceTagService.removeUserResourceTag(unitOfWork, nonExistingUserResourceTagId);
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });
    });
  });
});
