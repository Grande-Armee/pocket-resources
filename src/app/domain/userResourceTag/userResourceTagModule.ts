import { Module } from '@nestjs/common';

import { UserResourceTagMapper } from './mappers/userResourceTagMapper/userResourceTagMapper';
import { UserResourceTagRepositoryFactory } from './repositories/userResourceTagRepository/userResourceTagRepository';
import { UserResourceTagService } from './services/userResourceTagService/userResourceTagService';

@Module({
  providers: [UserResourceTagService, UserResourceTagMapper, UserResourceTagRepositoryFactory],
  exports: [UserResourceTagService],
})
export class UserResourceTagModule {}
