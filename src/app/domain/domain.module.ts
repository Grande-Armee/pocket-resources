import { Module } from '@nestjs/common';

import { ResourceModule } from './resource/resource.module';

@Module({
  imports: [ResourceModule],
  exports: [ResourceModule],
})
export class DomainModule {}
