import { Module } from '@nestjs/common';

import { ResourceModule } from './resource/resource.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [ResourceModule, TagModule],
  exports: [ResourceModule, TagModule],
})
export class DomainModule {}
