import { Module } from '@nestjs/common';

import { CollectionResourceBrokerController } from './controllers/broker/collectionResource/collectionResourceController';
import { CollectionResourceMapper } from './mappers/collectionResource/collectionResourceMapper';
import { CollectionResourceRepositoryFactory } from './repositories/collectionResource/collectionResourceRepository';
import { CollectionResourceService } from './services/collectionResource/collectionResourceService';

@Module({
  providers: [
    CollectionResourceService,
    CollectionResourceMapper,
    CollectionResourceRepositoryFactory,
    CollectionResourceBrokerController,
  ],
  exports: [CollectionResourceService],
})
export class CollectionResourceModule {}
