import { Module } from '@nestjs/common';

import { ResourceModule } from './resource/resourceModule';
import { TagModule } from './tag/tagModule';
import { UserResourceModule } from './userResource/userResourceModule';
import { UserResourceTagModule } from './userResourceTag/userResourceTagModule';

@Module({
  imports: [ResourceModule, TagModule, UserResourceModule, UserResourceTagModule],
  exports: [ResourceModule, TagModule, UserResourceModule, UserResourceTagModule],
})
export class DomainModule {}
