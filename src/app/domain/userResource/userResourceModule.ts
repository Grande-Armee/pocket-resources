import { Module } from '@nestjs/common';

import { ResourceModule } from '../resource/resourceModule';
import { TagModule } from '../tag/tagModule';
import { UserResourceMapper } from './mappers/userResourceMapper/userResourceMapper';
import { UserResourceRepositoryFactory } from './repositories/userResourceRepository/userResourceRepository';
import { UserResourceService } from './services/userResourceService/userResourceService';

@Module({
  imports: [ResourceModule, TagModule],
  providers: [UserResourceService, UserResourceMapper, UserResourceRepositoryFactory],
  exports: [UserResourceService],
})
export class UserResourceModule {}
