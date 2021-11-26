import { Module } from '@nestjs/common';

import { ResourceModule } from '../resource/resourceModule';
import { TagModule } from '../tag/tagModule';
import { UserResourceBrokerController } from './controllers/broker/userResourceBrokerController';
import { UserResourceMapper } from './mappers/userResource/userResourceMapper';
import { UserResourceRepositoryFactory } from './repositories/userResource/userResourceRepository';
import { UserResourceService } from './services/userResource/userResourceService';

@Module({
  imports: [ResourceModule, TagModule],
  providers: [UserResourceService, UserResourceMapper, UserResourceRepositoryFactory, UserResourceBrokerController],
  exports: [UserResourceService],
})
export class UserResourceModule {}
