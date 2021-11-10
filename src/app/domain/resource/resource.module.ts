import { Module } from '@nestjs/common';

import { ResourceMapper } from './mappers/resource/resource.mapper';
import { ResourceRepositoryFactory } from './repositories/resource/resource.repository';
import { ResourceService } from './services/resource/resource.service';

@Module({
  providers: [ResourceService, ResourceMapper, ResourceRepositoryFactory],
  exports: [ResourceService],
})
export class ResourceModule {}
