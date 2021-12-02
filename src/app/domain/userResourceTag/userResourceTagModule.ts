import { Module } from '@nestjs/common';

import { UserResourceTagBrokerController } from './controllers/broker/userResourceTag/userResourceTagController';
import { UserResourceTagMapper } from './mappers/userResourceTag/userResourceTagMapper';
import { UserResourceTagRepositoryFactory } from './repositories/userResourceTag/userResourceTagRepository';
import { UserResourceTagService } from './services/userResourceTag/userResourceTagService';

@Module({
  providers: [
    UserResourceTagService,
    UserResourceTagMapper,
    UserResourceTagRepositoryFactory,
    UserResourceTagBrokerController,
  ],
  exports: [UserResourceTagService],
})
export class UserResourceTagModule {}
