import { Module } from '@nestjs/common';

import { UserResourceModule } from '@domain/userResource/userResourceModule';

import { UserResourceTagBrokerController } from './controllers/broker/userResourceTag/userResourceTagController';
import { UserResourceTagMapper } from './mappers/userResourceTag/userResourceTagMapper';
import { UserResourceTagRepositoryFactory } from './repositories/userResourceTag/userResourceTagRepository';
import { UserResourceTagService } from './services/userResourceTag/userResourceTagService';

@Module({
  imports: [UserResourceModule],
  providers: [
    UserResourceTagService,
    UserResourceTagMapper,
    UserResourceTagRepositoryFactory,
    UserResourceTagBrokerController,
  ],
  exports: [UserResourceTagService],
})
export class UserResourceTagModule {}
