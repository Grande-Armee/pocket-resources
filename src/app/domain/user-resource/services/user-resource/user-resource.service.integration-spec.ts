import { TestingModule } from '@nestjs/testing';

import { PostgresHelper } from '../../../../../integration-tests/helpers/postgres/postgres.helper';
import { TestModuleHelper } from '../../../../../integration-tests/helpers/test-module/test-module.helper';
import { ResourceService } from '../../../resource/services/resource/resource.service';
import { TagRepositoryFactory } from '../../../tag/repositories/tag/tag.repository';
import { UserResourceTagRepositoryFactory } from '../../../user-resource-tag/repositories/user-resource-tag/user-resource-tag.repository';
import { UserResourceRepositoryFactory } from '../../repositories/user-resource/user-resource.repository';
import { UserResourceService } from './user-resource.service';

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

  describe('Get entities', () => {
    it('gets entities form the database', async () => {
      expect.assertions(1);

      await postgresHelper.runInTestTransaction(async (unitOfWork) => {
        const entityManager = unitOfWork.getEntityManager();
        const userResourceRepository = userResourceRepositoryFactory.create(entityManager);
        const userResourceTagRepository = userResourceTagRepositoryFactory.create(entityManager);
        const tagRepository = tagRepositoryFactory.create(entityManager);

        const userId = 'daf76e08-83f7-4ed5-9664-742105bdaa24';

        const resource = await resourceService.createResource(unitOfWork, {
          url: 'url',
        });

        const tag = await tagRepository.createOne({
          userId,
          color: 'asd',
          title: 'asd',
        });

        const tag2 = await tagRepository.createOne({
          userId,
          color: 'bcd',
          title: 'bcd',
        });

        const userResource = await userResourceRepository.createOne(resource.id);

        await userResourceTagRepository.createOne({
          tagId: tag.id,
          userResourceId: userResource.id,
        });

        await userResourceTagRepository.createOne({
          tagId: tag2.id,
          userResourceId: userResource.id,
        });

        const result = await userResourceRepository.findMany({ userId });

        expect(result.length).toBe(1);
      });
    });
  });
});
