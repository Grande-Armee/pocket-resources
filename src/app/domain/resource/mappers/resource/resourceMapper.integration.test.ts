import { Test, TestingModule } from '@nestjs/testing';

import { DomainModule } from '@domain/domainModule';
import { UserResource } from '@domain/userResource/entities/userResource';
import { UserResourceTestDataGenerator } from '@domain/userResource/testDataGenerators/userResourceTestDataGenerator';
import { PostgresHelper } from '@integration/helpers/postgresHelper/postgresHelper';
import { DatabaseModule } from '@shared/database/databaseModule';
import { UnitOfWorkModule } from '@shared/unitOfWork/unitOfWorkModule';

import { Resource } from '../../entities/resource';
import { ResourceTestDataGenerator } from '../../testDataGenerators/resourceTestDataGenerator';
import { ResourceMapper } from './resourceMapper';

describe('ResourceMapper', () => {
  let testingModule: TestingModule;
  let postgresHelper: PostgresHelper;
  let resourceTestDataGenerator: ResourceTestDataGenerator;
  let userResourceTestDataGenerator: UserResourceTestDataGenerator;

  let resourceMapper: ResourceMapper;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [DatabaseModule, UnitOfWorkModule, DomainModule],
    }).compile();

    postgresHelper = new PostgresHelper(testingModule);
    userResourceTestDataGenerator = new UserResourceTestDataGenerator();
    resourceTestDataGenerator = new ResourceTestDataGenerator();

    resourceMapper = testingModule.get(ResourceMapper);
  });

  afterEach(async () => {
    await testingModule.close();
  });

  describe('Map resource', () => {
    it('maps a resource with userResource relation from entity to dto', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { entityManager } = unitOfWork;

        const { url } = resourceTestDataGenerator.generateEntityData();
        const { userId } = userResourceTestDataGenerator.generateEntityData();

        const resource = entityManager.create(Resource, { url });

        const [savedResource] = await entityManager.save([resource]);

        const userResource = entityManager.create(UserResource, {
          userId: userId,
          resourceId: savedResource.id,
        });

        await entityManager.save([userResource]);

        const resourceDto = resourceMapper.mapEntityToDto(savedResource);

        expect(resourceDto).toEqual({
          id: savedResource.id,
          createdAt: savedResource.createdAt,
          updatedAt: savedResource.updatedAt,
          url: url,
          title: null,
          thumbnailUrl: null,
          content: null,
        });
      });
    });

    it('maps a resource with optional fields from entity to dto', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const { entityManager } = unitOfWork;

        const { url, title, thumbnailUrl, content } = resourceTestDataGenerator.generateEntityData();

        const resource = entityManager.create(Resource, { url });

        const [savedResource] = await entityManager.save([resource]);

        await entityManager.update(Resource, { id: savedResource.id }, { title, thumbnailUrl, content });

        const updatedResource = await entityManager.findOne(Resource, { id: savedResource.id });

        const resourceDto = resourceMapper.mapEntityToDto(updatedResource as Resource);

        expect(resourceDto).toEqual({
          id: savedResource.id,
          createdAt: savedResource.createdAt,
          updatedAt: savedResource.updatedAt,
          url: url,
          title: title,
          thumbnailUrl: thumbnailUrl,
          content: content,
        });
      });
    });
  });
});
