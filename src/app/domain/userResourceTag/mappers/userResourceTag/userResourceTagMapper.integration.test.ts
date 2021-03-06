import { Test, TestingModule } from '@nestjs/testing';

import { DomainModule } from '@domain/domainModule';
import { Resource } from '@domain/resource/entities/resource';
import { ResourceTestDataGenerator } from '@domain/resource/testDataGenerators/resourceTestDataGenerator';
import { Tag } from '@domain/tag/entities/tag';
import { TagTestDataGenerator } from '@domain/tag/testDataGenerators/tagTestDataGenerator';
import { UserResource } from '@domain/userResource/entities/userResource';
import { UserResourceTestDataGenerator } from '@domain/userResource/testDataGenerators/userResourceTestDataGenerator';
import { PostgresHelper } from '@integration/helpers/postgresHelper/postgresHelper';
import { DatabaseModule } from '@shared/database/databaseModule';
import { UnitOfWorkModule } from '@shared/unitOfWork/unitOfWorkModule';

import { UserResourceTag } from '../../entities/userResourceTag';
import { UserResourceTagMapper } from './userResourceTagMapper';

describe('UserResourceMapper', () => {
  let testingModule: TestingModule;
  let postgresHelper: PostgresHelper;
  let resourceTestDataGenerator: ResourceTestDataGenerator;
  let userResourceTestDataGenerator: UserResourceTestDataGenerator;
  let tagTestDataGenerator: TagTestDataGenerator;

  let userResourceTagMapper: UserResourceTagMapper;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [DatabaseModule, UnitOfWorkModule, DomainModule],
    }).compile();

    postgresHelper = new PostgresHelper(testingModule);
    userResourceTestDataGenerator = new UserResourceTestDataGenerator();
    resourceTestDataGenerator = new ResourceTestDataGenerator();
    tagTestDataGenerator = new TagTestDataGenerator();

    userResourceTagMapper = testingModule.get(UserResourceTagMapper);
  });

  afterEach(async () => {
    await testingModule.close();
  });

  describe('Map userResourceTag', () => {
    it('maps a userResourceTag from entity to dto', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { entityManager } = unitOfWork;

        const { url } = resourceTestDataGenerator.generateEntityData();
        const { userId } = userResourceTestDataGenerator.generateEntityData();

        const { color, title } = tagTestDataGenerator.generateEntityData();

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

        const userResourceTagDto = userResourceTagMapper.mapEntityToDto(savedUserResourceTag as UserResourceTag);

        expect(userResourceTagDto).toEqual({
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
