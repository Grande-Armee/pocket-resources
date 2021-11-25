import { Module } from '@nestjs/common';

import { ResourceModule } from '../resource/resourceModule';
import { CollectionBrokerController } from './controllers/broker/collectionBrokerController';
import { CollectionMapper } from './mappers/collection/collectionMapper';
import { CollectionRepositoryFactory } from './repositories/collection/collectionRepository';
import { CollectionService } from './services/collection/collectionService';

@Module({
  imports: [ResourceModule],
  providers: [CollectionService, CollectionMapper, CollectionRepositoryFactory, CollectionBrokerController],
  exports: [CollectionService, CollectionMapper],
})
export class CollectionModule {}
