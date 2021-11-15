import { TestingModule } from '@nestjs/testing';

import { UserResource } from '@domain/userResource/entities/userResource';
import { UserResourceTestDataGenerator } from '@domain/userResource/testDataGenerators/userResourceTestDataGenerator';
import { PostgresHelper } from '@integration/helpers/postgresHelper/postgresHelper';
import { TestModuleHelper } from '@integration/helpers/testModuleHelper/testModuleHelper';

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
    testingModule = await TestModuleHelper.createTestingModule();
    postgresHelper = new PostgresHelper(testingModule);
    userResourceTestDataGenerator = new UserResourceTestDataGenerator();
    resourceTestDataGenerator = new ResourceTestDataGenerator();

    resourceMapper = testingModule.get(ResourceMapper);
  });

  afterEach(async () => {
    await testingModule.close();
  });

  describe('Map resource', () => {
    it('maps a resource with user-resource relation from entity to dto', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();

        const { url } = resourceTestDataGenerator.generateEntityData();
        const { userId } = userResourceTestDataGenerator.generateEntityData();

        const resource = entityManager.create(Resource, { url });

        const [savedResource] = await entityManager.save([resource]);

        const userResource = entityManager.create(UserResource, {
          userId: userId,
          resourceId: savedResource.id,
        });

        await entityManager.save([userResource]);

        const resourceDTO = resourceMapper.mapEntityToDTO(savedResource);

        expect(resourceDTO).toEqual({
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
      expect.assertions(2);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();

        const { url, title, thumbnailUrl, content } = resourceTestDataGenerator.generateEntityData();

        const resource = entityManager.create(Resource, { url });

        const [savedResource] = await entityManager.save([resource]);

        await entityManager.update(Resource, { id: savedResource.id }, { title, thumbnailUrl, content });

        const updatedResource = await entityManager.findOne(Resource, { id: savedResource.id });

        expect(updatedResource).toBeTruthy();

        const resourceDTO = resourceMapper.mapEntityToDTO(updatedResource as Resource);

        expect(resourceDTO).toEqual({
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
