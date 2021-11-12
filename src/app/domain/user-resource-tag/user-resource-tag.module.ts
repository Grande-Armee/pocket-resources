import { Module } from '@nestjs/common';

import { UserResourceTagMapper } from './mappers/user-resource-tag/user-resource-tag.mapper';
import { UserResourceTagRepositoryFactory } from './repositories/user-resource-tag/user-resource-tag.repository';
import { UserResourceTagService } from './services/user-resource-tag/user-resource-tag.service';

@Module({
  providers: [UserResourceTagService, UserResourceTagMapper, UserResourceTagRepositoryFactory],
  exports: [UserResourceTagService],
})
export class UserResourceTagModule {}
