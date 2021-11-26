import { Module } from '@nestjs/common';

import { ResourceDto } from './controllers/broker/dtos/resourceDto';
import { ResourceBrokerController } from './controllers/broker/resourceBrokerController';
import { ResourceMapper } from './mappers/resource/resourceMapper';
import { ResourceRepositoryFactory } from './repositories/resource/resourceRepository';
import { ResourceService } from './services/resource/resourceService';

@Module({
  providers: [ResourceService, ResourceMapper, ResourceRepositoryFactory, ResourceBrokerController],
  exports: [ResourceService, ResourceMapper, ResourceDto],
})
export class ResourceModule {}
