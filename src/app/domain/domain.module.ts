import { Module } from '@nestjs/common';

import { ResourceModule } from './resource/resource.module';
import { TagModule } from './tag/tag.module';
import { UserResourceTagModule } from './user-resource-tag/user-resource-tag.module';
import { UserResourceModule } from './user-resource/user-resource.module';

@Module({
  imports: [ResourceModule, TagModule, UserResourceModule, UserResourceTagModule],
  exports: [ResourceModule, TagModule, UserResourceModule, UserResourceTagModule],
})
export class DomainModule {}
