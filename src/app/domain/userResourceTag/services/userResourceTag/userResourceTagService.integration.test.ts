import { Test, TestingModule } from '@nestjs/testing';

import { DomainModule } from '@domain/domainModule';
import { ResourceRepositoryFactory } from '@domain/resource/repositories/resource/resourceRepository';
import { ResourceTestDataGenerator } from '@domain/resource/testDataGenerators/resourceTestDataGenerator';
import { TagRepositoryFactory } from '@domain/tag/repositories/tag/tagRepository';
import { TagTestDataGenerator } from '@domain/tag/testDataGenerators/tagTestDataGenerator';
import { UserResourceRepositoryFactory } from '@domain/userResource/repositories/userResource/userResourceRepository';
import { UserResourceTestDataGenerator } from '@domain/userResource/testDataGenerators/userResourceTestDataGenerator';
import { UserResourceTagNotFoundError } from '@domain/userResourceTag/errors';
import { UserResourceTagCreatedEvent, UserResourceTagRemovedEvent } from '@domain/userResourceTag/integrationEvents';
import { UserResourceTagRepositoryFactory } from '@domain/userResourceTag/repositories/userResourceTag/userResourceTagRepository';
import { PostgresHelper } from '@integration/helpers/postgresHelper/postgresHelper';
import { DatabaseModule } from '@shared/database/databaseModule';
import { UnitOfWorkModule } from '@shared/unitOfWork/unitOfWorkModule';

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
    testingModule = await Test.createTestingModule({
      imports: [DatabaseModule, UnitOfWorkModule, DomainModule],
    }).compile();

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

  describe('Find user resource tag', () => {
    it('gets user resource tag from the database', async () => {
      expect.assertions(3);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { entityManager } = unitOfWork;

        const userResourceRepository = userResourceRepositoryFactory.create(entityManager);
        const userResourceTagRepository = userResourceTagRepositoryFactory.create(entityManager);
        const tagRepository = tagRepositoryFactory.create(entityManager);
        const resourceRepository = resourceRepositoryFactory.create(entityManager);

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
          userResourceId: userResource.id,
          tagId: tag1.id,
        });

        const foundUserResourceTagDTO = await userResourceTagService.findUserResourceTag(unitOfWork, {
          tagId: tag1.id,
          userId: userResourceData.userId,
          resourceId: resource.id,
        });

        expect(foundUserResourceTagDTO.id).toBe(userResourceTag.id);
        expect(foundUserResourceTagDTO.userResourceId).toBe(userResource.id);
        expect(foundUserResourceTagDTO.tagId).toBe(tag1.id);
      });
    });

    it('should throw if user resource tag id not found', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const tagId = userResourceTagTestDataGenerator.generateTagId();
        const userId = userResourceTagTestDataGenerator.generateUserId();
        const resourceId = userResourceTagTestDataGenerator.generateResourceId();

        try {
          await userResourceTagService.findUserResourceTag(unitOfWork, {
            tagId,
            userId,
            resourceId,
          });
        } catch (error) {
          expect(error).toBeInstanceOf(UserResourceTagNotFoundError);
        }
      });
    });
  });

  describe('Create user resource tag', () => {
    it('creates user resource tag in database', async () => {
      expect.assertions(5);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { entityManager, integrationEventsStore } = unitOfWork;

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

        const createdUserResourceTagDTO = await userResourceTagService.createUserResourceTag(unitOfWork, {
          tagId: tag1.id,
          userId: userResourceData.userId,
          resourceId: resource.id,
        });

        expect(createdUserResourceTagDTO.userResourceId).toBe(userResource.id);
        expect(createdUserResourceTagDTO.tagId).toBe(tag1.id);

        const userResourceDTO = await userResourceTagRepository.findOneById(createdUserResourceTagDTO.id);

        expect(userResourceDTO).not.toBeNull();

        const integrationEvents = integrationEventsStore.getEvents();

        expect(integrationEvents).toHaveLength(1);
        expect(integrationEvents.at(0)).toBeInstanceOf(UserResourceTagCreatedEvent);
      });
    });

    it('should not create user resource tag if userResourceTag with same userResourceId and tagId exists', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { entityManager } = unitOfWork;

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
          userResourceId: userResource.id,
          tagId: tag1.id,
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
      expect.assertions(3);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { entityManager, integrationEventsStore } = unitOfWork;

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
          userResourceId: userResource.id,
          tagId: tag1.id,
        });

        await userResourceTagService.removeUserResourceTag(unitOfWork, {
          userId: userResourceData.userId,
          resourceId: resource.id,
          tagId: tag1.id,
        });

        const userResourceTagInDb = await userResourceRepository.findOneById(userResourceTag.id);

        expect(userResourceTagInDb).toBeNull();

        const integrationEvents = integrationEventsStore.getEvents();

        expect(integrationEvents).toHaveLength(1);
        expect(integrationEvents.at(0)).toBeInstanceOf(UserResourceTagRemovedEvent);
      });
    });

    it('should throw if user resource tag with given id does not exist', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const tagId = userResourceTagTestDataGenerator.generateTagId();
        const userId = userResourceTagTestDataGenerator.generateUserId();
        const resourceId = userResourceTagTestDataGenerator.generateResourceId();

        try {
          await userResourceTagService.removeUserResourceTag(unitOfWork, {
            tagId,
            userId,
            resourceId,
          });
        } catch (error) {
          expect(error).toBeInstanceOf(UserResourceTagNotFoundError);
        }
      });
    });
  });
});
