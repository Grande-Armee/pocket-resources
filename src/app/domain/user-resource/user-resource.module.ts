import { Module } from '@nestjs/common';

import { ResourceModule } from '../resource/resource.module';
import { TagModule } from '../tag/tag.module';
import { UserResourceMapper } from './mappers/user-resource/user-resource.mapper';
import { UserResourceRepositoryFactory } from './repositories/user-resource/user-resource.repository';
import { UserResourceService } from './services/user-resource/user-resource.service';

@Module({
  imports: [ResourceModule, TagModule],
  providers: [UserResourceService, UserResourceMapper, UserResourceRepositoryFactory],
  exports: [UserResourceService],
})
export class UserResourceModule {}
