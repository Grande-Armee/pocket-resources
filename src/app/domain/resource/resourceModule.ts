import { Module } from '@nestjs/common';

import { ResourceMapper } from './mappers/resourceMapper/resourceMapper';
import { ResourceRepositoryFactory } from './repositories/resourceRepository/resourceRepository';
import { ResourceService } from './services/resourceService/resourceService';

@Module({
  providers: [ResourceService, ResourceMapper, ResourceRepositoryFactory],
  exports: [ResourceService, ResourceMapper],
})
export class ResourceModule {}
