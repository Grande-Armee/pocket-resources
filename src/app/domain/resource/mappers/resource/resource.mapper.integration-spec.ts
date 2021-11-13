import { TestingModule } from '@nestjs/testing';

import { PostgresHelper } from '../../../../../integration-tests/helpers/postgres/postgres.helper';
import { TestModuleHelper } from '../../../../../integration-tests/helpers/test-module/test-module.helper';
import { UserResource } from '../../../user-resource/entities/user-resource.entity';
import { Resource } from '../../entities/resource.entity';
import { ResourceTestFactory } from '../../tests-factories/resource.factory';
import { ResourceMapper } from './resource.mapper';

describe('ResourceMapper', () => {
  let testingModule: TestingModule;
  let postgresHelper: PostgresHelper;
  let resourceMapper: ResourceMapper;

  beforeEach(async () => {
    testingModule = await TestModuleHelper.createTestingModule();
    postgresHelper = new PostgresHelper(testingModule);
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

        const url = ResourceTestFactory.createUrl();

        const resource = entityManager.create(Resource, { url });

        const [savedResource] = await entityManager.save([resource]);

        const userId = ResourceTestFactory.createId();

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

        const url = ResourceTestFactory.createUrl();
        const title = ResourceTestFactory.createTitle();
        const thumbnailUrl = ResourceTestFactory.createUrl();
        const content = ResourceTestFactory.createContent();

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
