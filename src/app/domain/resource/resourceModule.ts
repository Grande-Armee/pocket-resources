import { Module } from '@nestjs/common';

import { ResourceDto } from './controllers/broker/dtos/resourceDto';
import { ResourceMapper } from './mappers/resource/resourceMapper';
import { ResourceRepositoryFactory } from './repositories/resource/resourceRepository';
import { ResourceService } from './services/resource/resourceService';

@Module({
  providers: [ResourceService, ResourceMapper, ResourceRepositoryFactory],
  exports: [ResourceService, ResourceMapper, ResourceDto],
})
export class ResourceModule {}
