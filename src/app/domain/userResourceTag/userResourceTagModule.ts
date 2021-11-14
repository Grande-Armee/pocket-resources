import { Module } from '@nestjs/common';

import { UserResourceTagMapper } from './mappers/userResourceTag/userResourceTagMapper';
import { UserResourceTagRepositoryFactory } from './repositories/userResourceTag/userResourceTagRepository';
import { UserResourceTagService } from './services/userResourceTag/userResourceTagService';

@Module({
  providers: [UserResourceTagService, UserResourceTagMapper, UserResourceTagRepositoryFactory],
  exports: [UserResourceTagService],
})
export class UserResourceTagModule {}
